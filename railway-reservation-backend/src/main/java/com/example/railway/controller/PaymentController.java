package com.example.railway.controller;

import com.example.railway.dto.PaymentRequest;
import com.example.railway.dto.PaymentResponse;
import com.example.railway.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Demo payment endpoints.
 *
 * POST /api/payments
 * GET  /api/payments/{bookingId}
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> makePayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.makePayment(request));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentByBooking(bookingId));
    }
}
