package com.example.railway.controller;

import com.example.railway.dto.PassengerResponse;
import com.example.railway.service.PassengerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Passenger endpoints.
 *
 * GET /api/passengers/{bookingId}
 */
@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<List<PassengerResponse>> getPassengers(@PathVariable Long bookingId) {
        return ResponseEntity.ok(passengerService.getPassengersByBooking(bookingId));
    }
}
