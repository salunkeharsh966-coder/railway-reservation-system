package com.example.demo.repository;
import com.example.demo.entity.*;
import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}
