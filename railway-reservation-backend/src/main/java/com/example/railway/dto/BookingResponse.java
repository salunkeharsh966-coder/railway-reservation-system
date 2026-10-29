package com.example.railway.dto;

import com.example.railway.entity.BookingStatus;
import com.example.railway.entity.ClassType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/** Full booking view (ticket) returned to the client. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private String pnr;
    private Long userId;
    private String userName;
    private Long trainId;
    private String trainNumber;
    private String trainName;
    private String source;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private LocalDate journeyDate;
    private ClassType classType;
    private Integer totalPassengers;
    private BigDecimal totalAmount;
    private BookingStatus bookingStatus;
    private LocalDateTime bookingDate;
    private List<PassengerResponse> passengers;
    private PaymentResponse payment;
}
