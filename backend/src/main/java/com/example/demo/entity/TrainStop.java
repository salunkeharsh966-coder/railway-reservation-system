package com.example.demo.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import lombok.Data;
@Entity @Data @Table(uniqueConstraints=@UniqueConstraint(columnNames={"trainId","stopOrder"}))
public class TrainStop {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private Long trainId, stationId; private int stopOrder; private String arrival, departure;
}
