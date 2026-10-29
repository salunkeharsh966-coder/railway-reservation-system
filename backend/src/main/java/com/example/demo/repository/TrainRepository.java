package com.example.demo.repository;
import com.example.demo.entity.*;
import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface TrainRepository extends JpaRepository<Train, Long> {
  @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select t from Train t where t.id=:id") Optional<Train> lockById(@Param("id") Long id);
}
