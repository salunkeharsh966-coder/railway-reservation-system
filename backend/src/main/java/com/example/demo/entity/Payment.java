package com.example.demo.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import lombok.Data;
@Entity @Data 
public class Payment {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private Long bookingId; @Column(unique=true) private String razorpayOrderId; private String razorpayPaymentId, status; private BigDecimal amount, refundAmount;
}
