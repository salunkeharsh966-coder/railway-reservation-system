package com.example.railway.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * A passenger travelling under a booking.
 */
@Entity
@Table(name = "passengers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false, length = 10)
    private String gender;

    @Column(name = "seat_preference", length = 20)
    private String seatPreference;

    @Column(name = "seat_number", length = 10)
    private String seatNumber;
}
