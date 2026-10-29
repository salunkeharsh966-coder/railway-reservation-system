package com.example.demo.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import lombok.Data;
@Entity @Data @Table(indexes=@Index(columnList="trainId,journeyDate,seatId"))
public class Reservation {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private Long bookingId, seatId, trainId; private LocalDate journeyDate; private int fromOrder, toOrder; private String passengerName, coach; private int age, seatNo; private boolean active = true;
}
