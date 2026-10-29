package com.example.railway.dto;

import com.example.railway.entity.Payment;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Payment view returned to the client. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private String paymentId;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime paymentDate;

    public static PaymentResponse from(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .bookingId(p.getBooking() != null ? p.getBooking().getId() : null)
                .paymentId(p.getPaymentId())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod())
                .paymentStatus(p.getPaymentStatus())
                .paymentDate(p.getPaymentDate())
                .build();
    }
}
