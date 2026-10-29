package com.example.demo.repository;
import com.example.demo.entity.*;
import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface SeatRepository extends JpaRepository<Seat, Long> {
  @Query("select s from Seat s where s.trainId=:t and s.classType=:c and s.id not in (select r.seatId from Reservation r where r.trainId=:t and r.journeyDate=:d and r.active=true and r.fromOrder<:to and r.toOrder>:from) order by s.id")
  List<Seat> free(@Param("t") Long t, @Param("c") String c, @Param("d") LocalDate d, @Param("from") int from, @Param("to") int to);
}
