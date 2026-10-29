package com.example.demo.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import lombok.Data;
@Entity @Data @Table(indexes=@Index(columnList="userId"))
public class Booking {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(unique=true) private String pnr; private Long userId, trainId; private String trainName, fromCode, toCode, classType; private LocalDate journeyDate; private int fromOrder, toOrder;
  @Enumerated(EnumType.STRING) private Status status; private BigDecimal amount; private LocalDateTime createdAt = LocalDateTime.now(), holdExpiresAt;
}
