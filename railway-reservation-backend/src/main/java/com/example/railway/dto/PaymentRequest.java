package com.example.railway.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;

/** Payload for a demo payment. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    private Long bookingId;

    private BigDecimal amount;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
