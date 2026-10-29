package com.example.railway.service;

import com.example.railway.dto.PaymentRequest;
import com.example.railway.dto.PaymentResponse;
import com.example.railway.entity.Booking;
import com.example.railway.entity.Payment;
import com.example.railway.exception.BadRequestException;
import com.example.railway.exception.ResourceNotFoundException;
import com.example.railway.repository.BookingRepository;
import com.example.railway.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

/**
 * Demo payment handling. No real gateway is contacted: a payment id is
 * generated locally and the record is marked SUCCESS.
 */
@Service
public class PaymentService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public PaymentResponse makePayment(PaymentRequest request) {
        if (request.getBookingId() == null) {
            throw new BadRequestException("Booking id is required to make a payment");
        }
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id " + request.getBookingId()));

        if (paymentRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("A payment already exists for this booking");
        }

        Payment payment = Payment.builder()
                .booking(booking)
                .paymentId("PAY" + System.currentTimeMillis()
                        + (100 + RANDOM.nextInt(900)))
                .amount(booking.getTotalAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("SUCCESS")
                .build();

        return PaymentResponse.from(paymentRepository.save(payment));
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBooking(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No payment found for booking " + bookingId));
        return PaymentResponse.from(payment);
    }
}
