package com.example.railway.service;

import com.example.railway.dto.PassengerResponse;
import com.example.railway.exception.ResourceNotFoundException;
import com.example.railway.repository.BookingRepository;
import com.example.railway.repository.PassengerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Read access to the passengers of a booking. */
@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;
    private final BookingRepository bookingRepository;

    public PassengerService(PassengerRepository passengerRepository,
                            BookingRepository bookingRepository) {
        this.passengerRepository = passengerRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<PassengerResponse> getPassengersByBooking(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new ResourceNotFoundException("Booking not found with id " + bookingId);
        }
        return passengerRepository.findByBookingId(bookingId)
                .stream().map(PassengerResponse::from).toList();
    }
}
