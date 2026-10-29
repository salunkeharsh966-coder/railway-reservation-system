package com.example.railway.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/** A single passenger inside a booking request. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PassengerRequest {

    @NotBlank(message = "Passenger name is required")
    @Size(max = 100, message = "Passenger name must be at most 100 characters")
    private String name;

    @NotNull(message = "Passenger age is required")
    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 120, message = "Age must be at most 120")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String seatPreference;
}
