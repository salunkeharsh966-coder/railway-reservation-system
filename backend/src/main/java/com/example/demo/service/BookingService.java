package com.example.demo.service;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import java.math.*;
import java.time.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service @RequiredArgsConstructor
public class BookingService {
  public record Pax(String name, int age) {}
  public record BookReq(Long trainId, String from, String to, LocalDate date, String classType, List<Pax> passengers) {}

  private final TrainRepository trains; private final StationRepository stations; private final TrainStopRepository stops;
  private final SeatRepository seats; private final BookingRepository bookings; private final ReservationRepository res;
  private final PaymentRepository payments; private final UserRepository users; private final EmailService email;
  @Value("${app.cancel-fee-percent}") int feePct;
  @Value("${app.hold-minutes}") int holdMinutes;

  public static ResponseStatusException bad(String m) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, m); }
  public static ResponseStatusException conflict(String m) { return new ResponseStatusException(HttpStatus.CONFLICT, m); }

  int order(Long trainId, String code) {
    Station s = stations.findByCode(code.toUpperCase()).orElseThrow(() -> bad("Unknown station " + code));
    return stops.findByTrainIdAndStationId(trainId, s.getId()).orElseThrow(() -> bad("Train does not stop at " + code)).getStopOrder();
  }
  int[] orders(Long trainId, String from, String to) {
    int f = order(trainId, from), t = order(trainId, to);
    if (f >= t) throw bad("Destination must come after origin on this train's route");
    return new int[] { f, t };
  }
  static BigDecimal mult(String cls) {
    return switch (cls) { case "SLEEPER" -> BigDecimal.ONE; case "AC3" -> new BigDecimal("1.8"); case "AC2" -> new BigDecimal("2.5"); case "AC1" -> new BigDecimal("4");
      default -> throw bad("Unknown class " + cls); };
  }
  public BigDecimal fare(Train t, String cls, int from, int to) {
    return t.getFarePerStop().multiply(mult(cls)).multiply(BigDecimal.valueOf(to - from)).setScale(2, RoundingMode.HALF_UP);
  }
  public int availability(Long trainId, String from, String to, LocalDate date, String cls) {
    int[] o = orders(trainId, from, to);
    return seats.free(trainId, cls, date, o[0], o[1]).size();
  }

  @Transactional
  public Map<String, Object> book(Long userId, BookReq r) {
    if (r.passengers() == null || r.passengers().isEmpty() || r.passengers().size() > 6) throw bad("1 to 6 passengers required");
    for (Pax p : r.passengers()) if (p.name() == null || p.name().isBlank() || p.age() < 1 || p.age() > 120) throw bad("Invalid passenger details");
    if (r.date() == null || r.date().isBefore(LocalDate.now())) throw bad("Journey date cannot be in the past");
    Train t = trains.lockById(r.trainId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Train not found"));
    int[] o = orders(t.getId(), r.from(), r.to());
    BigDecimal unit = fare(t, r.classType(), o[0], o[1]);
    List<Seat> free = seats.free(t.getId(), r.classType(), r.date(), o[0], o[1]);
    int n = r.passengers().size();
    if (free.size() < n) throw conflict("Only " + free.size() + " seat(s) available for this journey");
    Booking b = new Booking();
    b.setUserId(userId); b.setTrainId(t.getId()); b.setTrainName(t.getNumber() + " " + t.getName());
    b.setFromCode(r.from().toUpperCase()); b.setToCode(r.to().toUpperCase()); b.setClassType(r.classType());
    b.setJourneyDate(r.date()); b.setFromOrder(o[0]); b.setToOrder(o[1]); b.setStatus(Status.PENDING_PAYMENT);
    b.setAmount(unit.multiply(BigDecimal.valueOf(n))); b.setHoldExpiresAt(LocalDateTime.now().plusMinutes(holdMinutes));
    b = bookings.save(b);
    for (int i = 0; i < n; i++) {
      Seat s = free.get(i); Reservation x = new Reservation();
      x.setBookingId(b.getId()); x.setSeatId(s.getId()); x.setTrainId(t.getId()); x.setJourneyDate(r.date());
      x.setFromOrder(o[0]); x.setToOrder(o[1]); x.setPassengerName(r.passengers().get(i).name()); x.setAge(r.passengers().get(i).age());
      x.setCoach(s.getCoach()); x.setSeatNo(s.getSeatNo()); res.save(x);
    }
    return view(b);
  }

  public Booking owned(Long userId, Long id) {
    Booking b = bookings.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
    if (!b.getUserId().equals(userId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found");
    return b;
  }

  public Map<String, Object> view(Booking b) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("id", b.getId()); m.put("pnr", b.getPnr()); m.put("status", b.getStatus()); m.put("train", b.getTrainName());
    m.put("from", b.getFromCode()); m.put("to", b.getToCode()); m.put("date", b.getJourneyDate()); m.put("classType", b.getClassType());
    m.put("amount", b.getAmount()); m.put("holdExpiresAt", b.getHoldExpiresAt());
    List<Map<String, Object>> ps = new ArrayList<>();
    for (Reservation r : res.findByBookingId(b.getId()))
      ps.add(Map.of("name", r.getPassengerName(), "age", r.getAge(), "coach", r.getCoach(), "seat", r.getSeatNo()));
    m.put("passengers", ps);
    payments.findByBookingId(b.getId()).ifPresent(p -> { m.put("paymentStatus", p.getStatus()); m.put("refundAmount", p.getRefundAmount()); });
    return m;
  }

  public List<Map<String, Object>> mine(Long userId) { return bookings.findByUserIdOrderByIdDesc(userId).stream().map(this::view).toList(); }

  @Transactional
  public Map<String, Object> cancel(Long userId, Long id) {
    Booking b = owned(userId, id);
    trains.lockById(b.getTrainId());
    if (b.getStatus() != Status.CONFIRMED) throw conflict("Only confirmed bookings can be cancelled");
    if (b.getJourneyDate().isBefore(LocalDate.now())) throw bad("Journey date has passed");
    res.findByBookingId(id).forEach(r -> r.setActive(false));
    b.setStatus(Status.CANCELLED);
    payments.findByBookingId(id).ifPresent(p -> {
      p.setRefundAmount(p.getAmount().multiply(BigDecimal.valueOf(100 - feePct)).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
      p.setStatus("REFUND_PENDING");
    });
    users.findById(userId).ifPresent(u -> email.send(u.getEmail(), "Booking cancelled - PNR " + b.getPnr(), "Your booking " + b.getPnr() + " was cancelled. A refund is being processed."));
    return view(b);
  }

  @Scheduled(fixedDelay = 60000) @Transactional
  public void expireHolds() {
    for (Booking b : bookings.findByStatusAndHoldExpiresAtBefore(Status.PENDING_PAYMENT, LocalDateTime.now())) {
      b.setStatus(Status.EXPIRED);
      res.findByBookingId(b.getId()).forEach(r -> r.setActive(false));
    }
  }
}
