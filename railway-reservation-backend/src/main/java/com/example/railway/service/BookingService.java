package com.example.railway.service;

import com.example.railway.dto.*;
import com.example.railway.entity.*;
import com.example.railway.exception.BadRequestException;
import com.example.railway.exception.ResourceNotFoundException;
import com.example.railway.repository.BookingRepository;
import com.example.railway.repository.TrainRepository;
import com.example.railway.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

/**
 * Booking creation, listing, ticket retrieval and cancellation.
 *
 * Every method that reads a lazy relation (user, train, passengers) is
 * {@code @Transactional} so the DTO is built while the session is still open.
 */
@Service
public class BookingService {

    private static final String PNR_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TrainRepository trainRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          TrainRepository trainRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.trainRepository = trainRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + request.getUserId()));
        Train train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new ResourceNotFoundException("Train not found with id " + request.getTrainId()));

        ClassType classType;
        try {
            classType = ClassType.valueOf(request.getClassType().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid class type: " + request.getClassType());
        }

        int passengerCount = request.getPassengers().size();
        if (train.getAvailableSeats() < passengerCount) {
            throw new BadRequestException("Only " + train.getAvailableSeats()
                    + " seat(s) available on this train");
        }

        BigDecimal fare = fareFor(train, classType);
        BigDecimal total = fare.multiply(BigDecimal.valueOf(passengerCount));

        Booking booking = Booking.builder()
                .pnr(generateUniquePnr())
                .user(user)
                .train(train)
                .journeyDate(request.getJourneyDate())
                .classType(classType)
                .totalPassengers(passengerCount)
                .totalAmount(total)
                .bookingStatus(BookingStatus.CONFIRMED)
                .passengers(new ArrayList<>())
                .build();

        int seatIndex = 1;
        for (PassengerRequest pr : request.getPassengers()) {
            Passenger passenger = Passenger.builder()
                    .booking(booking)
                    .name(pr.getName().trim())
                    .age(pr.getAge())
                    .gender(pr.getGender())
                    .seatPreference(pr.getSeatPreference())
                    .seatNumber(seatLabel(classType, seatIndex++))
                    .build();
            booking.getPassengers().add(passenger);
        }

        train.setAvailableSeats(train.getAvailableSeats() - passengerCount);
        trainRepository.save(train);

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsForUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id " + userId);
        }
        return bookingRepository.findByUserIdWithDetails(userId)
                .stream().map(BookingService::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
        return toResponse(booking);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByPnr(String pnr) {
        Booking booking = bookingRepository.findByPnr(pnr)
                .orElseThrow(() -> new ResourceNotFoundException("No booking found with PNR " + pnr));
        return toResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllWithDetails()
                .stream().map(BookingService::toResponse).toList();
    }

    @Transactional
    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking is already cancelled");
        }
        booking.setBookingStatus(BookingStatus.CANCELLED);

        // Return the seats to the train.
        Train train = booking.getTrain();
        train.setAvailableSeats(train.getAvailableSeats() + booking.getTotalPassengers());
        trainRepository.save(train);

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalTrains = trainRepository.count();
        long totalBookings = bookingRepository.count();
        long confirmed = bookingRepository.countByBookingStatus(BookingStatus.CONFIRMED);
        long cancelled = bookingRepository.countByBookingStatus(BookingStatus.CANCELLED);
        BigDecimal revenue = bookingRepository.sumAmountByStatus(BookingStatus.CONFIRMED);
        return DashboardStats.builder()
                .totalUsers(totalUsers)
                .totalTrains(totalTrains)
                .totalBookings(totalBookings)
                .confirmedBookings(confirmed)
                .cancelledBookings(cancelled)
                .totalRevenue(revenue)
                .build();
    }

    // ---------------------------------------------------------------- helpers

    private static BigDecimal fareFor(Train train, ClassType classType) {
        return switch (classType) {
            case SLEEPER -> train.getFareSleeper();
            case AC_3 -> train.getFareAc3();
            case AC_2 -> train.getFareAc2();
            case AC_1 -> train.getFareAc1();
            case CHAIR_CAR -> train.getFareCc();
        };
    }

    private static String seatLabel(ClassType classType, int index) {
        String prefix = switch (classType) {
            case SLEEPER -> "S";
            case AC_3 -> "B";
            case AC_2 -> "A";
            case AC_1 -> "H";
            case CHAIR_CAR -> "C";
        };
        return prefix + index;
    }

    private String generateUniquePnr() {
        for (int attempt = 0; attempt < 20; attempt++) {
            StringBuilder sb = new StringBuilder(10);
            for (int i = 0; i < 10; i++) {
                sb.append(PNR_CHARS.charAt(RANDOM.nextInt(PNR_CHARS.length())));
            }
            String pnr = sb.toString();
            if (!bookingRepository.existsByPnr(pnr)) {
                return pnr;
            }
        }
        throw new BadRequestException("Could not generate a unique PNR, please try again");
    }

    static BookingResponse toResponse(Booking b) {
        List<PassengerResponse> passengers = b.getPassengers() == null ? List.of()
                : b.getPassengers().stream().map(PassengerResponse::from).toList();
        return BookingResponse.builder()
                .id(b.getId())
                .pnr(b.getPnr())
                .userId(b.getUser() != null ? b.getUser().getId() : null)
                .userName(b.getUser() != null ? b.getUser().getName() : null)
                .trainId(b.getTrain() != null ? b.getTrain().getId() : null)
                .trainNumber(b.getTrain() != null ? b.getTrain().getTrainNumber() : null)
                .trainName(b.getTrain() != null ? b.getTrain().getTrainName() : null)
                .source(b.getTrain() != null ? b.getTrain().getSource() : null)
                .destination(b.getTrain() != null ? b.getTrain().getDestination() : null)
                .departureTime(b.getTrain() != null ? b.getTrain().getDepartureTime() : null)
                .arrivalTime(b.getTrain() != null ? b.getTrain().getArrivalTime() : null)
                .journeyDate(b.getJourneyDate())
                .classType(b.getClassType())
                .totalPassengers(b.getTotalPassengers())
                .totalAmount(b.getTotalAmount())
                .bookingStatus(b.getBookingStatus())
                .bookingDate(b.getBookingDate())
                .passengers(passengers)
                .payment(b.getPayment() != null ? PaymentResponse.from(b.getPayment()) : null)
                .build();
    }
}
