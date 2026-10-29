package com.example.railway.repository;

import com.example.railway.entity.Booking;
import com.example.railway.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByPnr(String pnr);

    boolean existsByPnr(String pnr);

    /** All bookings of one user, newest first, with train and passengers fetched. */
    @Query("""
           SELECT DISTINCT b FROM Booking b
             JOIN FETCH b.train
             LEFT JOIN FETCH b.passengers
            WHERE b.user.id = :userId
            ORDER BY b.bookingDate DESC
           """)
    List<Booking> findByUserIdWithDetails(@Param("userId") Long userId);

    /** All bookings, newest first, with user and train fetched (admin view). */
    @Query("""
           SELECT DISTINCT b FROM Booking b
             JOIN FETCH b.user
             JOIN FETCH b.train
            ORDER BY b.bookingDate DESC
           """)
    List<Booking> findAllWithDetails();

    /** Single booking with user, train and passengers fetched. */
    @Query("""
           SELECT b FROM Booking b
             JOIN FETCH b.user
             JOIN FETCH b.train
             LEFT JOIN FETCH b.passengers
            WHERE b.id = :id
           """)
    Optional<Booking> findByIdWithDetails(@Param("id") Long id);

    long countByBookingStatus(BookingStatus status);

    /** Total amount collected across confirmed bookings. */
    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.bookingStatus = :status")
    BigDecimal sumAmountByStatus(@Param("status") BookingStatus status);
}
