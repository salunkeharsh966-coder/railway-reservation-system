package com.example.railway.repository;

import com.example.railway.entity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {

    Optional<Train> findByTrainNumber(String trainNumber);

    boolean existsByTrainNumber(String trainNumber);

    /**
     * Search trains by source and destination (case-insensitive, partial match).
     * Both parameters are typed strings, so no enum/string mismatch can occur.
     */
    @Query("""
           SELECT t FROM Train t
            WHERE LOWER(t.source) LIKE LOWER(CONCAT('%', :source, '%'))
              AND LOWER(t.destination) LIKE LOWER(CONCAT('%', :destination, '%'))
            ORDER BY t.departureTime ASC
           """)
    List<Train> searchTrains(@Param("source") String source,
                             @Param("destination") String destination);

    /** Distinct source stations, for the search dropdown. */
    @Query("SELECT DISTINCT t.source FROM Train t ORDER BY t.source")
    List<String> findDistinctSources();

    /** Distinct destination stations, for the search dropdown. */
    @Query("SELECT DISTINCT t.destination FROM Train t ORDER BY t.destination")
    List<String> findDistinctDestinations();
}
