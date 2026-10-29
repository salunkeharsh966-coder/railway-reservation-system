package com.example.railway.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

/** Payload for creating or updating a train (admin only). */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainRequest {

    @NotBlank(message = "Train number is required")
    @Size(max = 10, message = "Train number must be at most 10 characters")
    private String trainNumber;

    @NotBlank(message = "Train name is required")
    @Size(max = 120, message = "Train name must be at most 120 characters")
    private String trainName;

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotBlank(message = "Departure time is required")
    private String departureTime;

    @NotBlank(message = "Arrival time is required")
    private String arrivalTime;

    @NotNull(message = "Distance is required")
    @Min(value = 1, message = "Distance must be greater than 0")
    private Integer distance;

    @NotBlank(message = "Train type is required")
    private String trainType;

    @NotNull(message = "Available seats is required")
    @Min(value = 0, message = "Available seats cannot be negative")
    private Integer availableSeats;

    @NotNull(message = "Sleeper fare is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Fare must be greater than 0")
    private BigDecimal fareSleeper;

    @NotNull(message = "AC 3-tier fare is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Fare must be greater than 0")
    private BigDecimal fareAc3;

    @NotNull(message = "AC 2-tier fare is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Fare must be greater than 0")
    private BigDecimal fareAc2;

    @NotNull(message = "AC 1-tier fare is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Fare must be greater than 0")
    private BigDecimal fareAc1;

    @NotNull(message = "Chair car fare is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Fare must be greater than 0")
    private BigDecimal fareCc;
}
