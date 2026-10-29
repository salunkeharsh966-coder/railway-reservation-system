package com.example.railway.dto;

import com.example.railway.entity.Passenger;
import lombok.*;

/** Passenger view returned to the client. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PassengerResponse {
    private Long id;
    private String name;
    private Integer age;
    private String gender;
    private String seatPreference;
    private String seatNumber;

    public static PassengerResponse from(Passenger p) {
        return PassengerResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .age(p.getAge())
                .gender(p.getGender())
                .seatPreference(p.getSeatPreference())
                .seatNumber(p.getSeatNumber())
                .build();
    }
}
