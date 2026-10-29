package com.example.demo.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import lombok.Data;
@Entity @Data @Table(indexes=@Index(columnList="trainId,classType"))
public class Seat {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private Long trainId; private String coach, classType; private int seatNo;
}
