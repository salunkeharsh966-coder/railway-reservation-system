package com.example.demo.repository;
import com.example.demo.entity.*;
import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface BookingRepository extends JpaRepository<Booking, Long> {
  List<Booking> findByUserIdOrderByIdDesc(Long u); Optional<Booking> findByPnr(String p); List<Booking> findByStatusAndHoldExpiresAtBefore(Status s, LocalDateTime t); long countByStatus(Status s);
}
