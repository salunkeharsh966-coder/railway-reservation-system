package com.example.demo.service;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import static com.example.demo.service.BookingService.*;

@Service @RequiredArgsConstructor
public class PaymentService {
  private final BookingService bookingSvc; private final BookingRepository bookings; private final PaymentRepository payments;
  private final UserRepository users; private final EmailService email;
  @Value("${razorpay.key-id}") String keyId;
  @Value("${razorpay.key-secret}") String secret;
  private static final SecureRandom RNG = new SecureRandom();

  boolean dev() { return keyId == null || keyId.isBlank(); }

  @Transactional
  public Map<String, Object> createOrder(Long userId, Long bookingId) {
    Booking b = bookingSvc.owned(userId, bookingId);
    if (b.getStatus() != Status.PENDING_PAYMENT || b.getHoldExpiresAt().isBefore(LocalDateTime.now())) throw conflict("Booking is no longer payable");
    Payment p = payments.findByBookingId(bookingId).orElseGet(() -> {
      Payment n = new Payment(); n.setBookingId(bookingId); n.setAmount(b.getAmount()); n.setStatus("CREATED");
      n.setRazorpayOrderId(newOrder(b)); return payments.save(n);
    });
    return Map.of("paymentId", p.getId(), "orderId", p.getRazorpayOrderId(), "amountPaise", b.getAmount().movePointRight(2).longValue(), "keyId", keyId, "devMode", dev());
  }

  String newOrder(Booking b) {
    if (dev()) return "order_dev_" + UUID.randomUUID();
    HttpHeaders h = new HttpHeaders(); h.setBasicAuth(keyId, secret); h.setContentType(MediaType.APPLICATION_JSON);
    Map<String, Object> body = Map.of("amount", b.getAmount().movePointRight(2).longValue(), "currency", "INR", "receipt", "bk_" + b.getId());
    Map<?, ?> r = new RestTemplate().postForObject("https://api.razorpay.com/v1/orders", new HttpEntity<>(body, h), Map.class);
    return (String) r.get("id");
  }

  static String hmac(String key, String data) throws Exception {
    Mac m = Mac.getInstance("HmacSHA256"); m.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
    StringBuilder sb = new StringBuilder();
    for (byte x : m.doFinal(data.getBytes(StandardCharsets.UTF_8))) sb.append(String.format("%02x", x));
    return sb.toString();
  }

  @Transactional
  public Map<String, Object> verify(Long userId, String orderId, String paymentId, String signature) throws Exception {
    Payment p = payments.findByRazorpayOrderId(orderId).orElseThrow(() -> bad("Unknown order"));
    Booking b = bookingSvc.owned(userId, p.getBookingId());
    if ("PAID".equals(p.getStatus())) return bookingSvc.view(b); // idempotent
    boolean ok = dev() ? "dev".equals(signature)
      : signature != null && MessageDigest.isEqual(hmac(secret, orderId + "|" + paymentId).getBytes(), signature.getBytes());
    if (!ok) throw bad("Payment signature verification failed");
    if (b.getStatus() != Status.PENDING_PAYMENT) throw conflict("Booking expired before payment was verified; contact support for a refund");
    p.setStatus("PAID"); p.setRazorpayPaymentId(paymentId);
    b.setStatus(Status.CONFIRMED); b.setPnr(newPnr());
    users.findById(userId).ifPresent(u -> email.send(u.getEmail(), "Booking confirmed - PNR " + b.getPnr(),
      "Train " + b.getTrainName() + "\n" + b.getFromCode() + " -> " + b.getToCode() + "\nDate: " + b.getJourneyDate() + "\nPNR: " + b.getPnr() + "\nAmount: " + b.getAmount()));
    return bookingSvc.view(b);
  }

  String newPnr() {
    String s;
    do { s = String.valueOf(1000000000L + (long) (RNG.nextDouble() * 8999999999L)); } while (bookings.findByPnr(s).isPresent());
    return s;
  }
}
