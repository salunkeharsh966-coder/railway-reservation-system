package com.example.demo.repository;
import com.example.demo.entity.*;
import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface PaymentRepository extends JpaRepository<Payment, Long> {
  Optional<Payment> findByBookingId(Long b); Optional<Payment> findByRazorpayOrderId(String o);
  @Query("select coalesce(sum(p.amount),0) from Payment p where p.status<>'CREATED'") BigDecimal totalPaid();
  @Query("select coalesce(sum(p.refundAmount),0) from Payment p") BigDecimal totalRefunds();
  long countByStatus(String s);
}
