package com.example.demo.controller;
import com.example.demo.entity.Booking;
import com.example.demo.repository.BookingRepository;
import com.example.demo.service.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class BookingController {
  public record OrderReq(Long bookingId) {}
  public record VerifyReq(String orderId, String paymentId, String signature) {}
  private final BookingService svc; private final PaymentService pay; private final BookingRepository bookings;
  Long uid(Authentication a) { return (Long) a.getPrincipal(); }

  @PostMapping("/bookings") public Map<String, Object> book(Authentication a, @RequestBody BookingService.BookReq r) { return svc.book(uid(a), r); }
  @GetMapping("/bookings/my") public List<Map<String, Object>> mine(Authentication a) { return svc.mine(uid(a)); }
  @GetMapping("/bookings/{id}") public Map<String, Object> one(Authentication a, @PathVariable Long id) { return svc.view(svc.owned(uid(a), id)); }
  @PostMapping("/bookings/{id}/cancel") public Map<String, Object> cancel(Authentication a, @PathVariable Long id) { return svc.cancel(uid(a), id); }

  @GetMapping("/bookings/pnr/{pnr}")
  public Map<String, Object> pnr(@PathVariable String pnr) {
    Booking b = bookings.findByPnr(pnr).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PNR not found"));
    return Map.of("pnr", b.getPnr(), "status", b.getStatus(), "train", b.getTrainName(), "from", b.getFromCode(), "to", b.getToCode(), "date", b.getJourneyDate(), "classType", b.getClassType());
  }

  @PostMapping("/payments/create-order") public Map<String, Object> order(Authentication a, @RequestBody OrderReq r) { return pay.createOrder(uid(a), r.bookingId()); }
  @PostMapping("/payments/verify") public Map<String, Object> verify(Authentication a, @RequestBody VerifyReq r) throws Exception { return pay.verify(uid(a), r.orderId(), r.paymentId(), r.signature()); }
  @GetMapping("/health") public Map<String, String> health() { return Map.of("status", "UP"); }
}
