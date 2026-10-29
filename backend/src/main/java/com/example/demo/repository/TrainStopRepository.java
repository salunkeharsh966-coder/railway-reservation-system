package com.example.demo.repository;
import com.example.demo.entity.*;
import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
public interface TrainStopRepository extends JpaRepository<TrainStop, Long> {
  Optional<TrainStop> findByTrainIdAndStationId(Long t, Long s);
  @Query("select a.trainId from TrainStop a, TrainStop b where a.trainId=b.trainId and a.stationId=:f and b.stationId=:t and a.stopOrder<b.stopOrder") List<Long> trainsBetween(@Param("f") Long f, @Param("t") Long t);
}
