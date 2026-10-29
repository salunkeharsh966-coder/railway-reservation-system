package com.example.railway.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * A train service running between a source and a destination.
 */
@Entity
@Table(name = "trains")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "train_number", nullable = false, unique = true, length = 10)
    private String trainNumber;

    @Column(name = "train_name", nullable = false, length = 120)
    private String trainName;

    @Column(nullable = false, length = 80)
    private String source;

    @Column(nullable = false, length = 80)
    private String destination;

    @Column(name = "departure_time", nullable = false, length = 10)
    private String departureTime;

    @Column(name = "arrival_time", nullable = false, length = 10)
    private String arrivalTime;

    @Column(nullable = false)
    private Integer distance;

    @Column(name = "train_type", nullable = false, length = 40)
    private String trainType;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "fare_sleeper", nullable = false, precision = 10, scale = 2)
    private BigDecimal fareSleeper;

    @Column(name = "fare_ac3", nullable = false, precision = 10, scale = 2)
    private BigDecimal fareAc3;

    @Column(name = "fare_ac2", nullable = false, precision = 10, scale = 2)
    private BigDecimal fareAc2;

    @Column(name = "fare_ac1", nullable = false, precision = 10, scale = 2)
    private BigDecimal fareAc1;

    @Column(name = "fare_cc", nullable = false, precision = 10, scale = 2)
    private BigDecimal fareCc;
}
