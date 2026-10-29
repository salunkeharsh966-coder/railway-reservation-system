package com.example.demo.service;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import java.math.BigDecimal;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static com.example.demo.service.BookingService.bad;

@Service @RequiredArgsConstructor
public class AdminService {
  public record StopReq(String code, String arrival, String departure) {}
  public record TrainReq(String number, String name, BigDecimal farePerStop, List<StopReq> stops, Map<String, Integer> seats) {}
  private final UserRepository users; private final StationRepository stations; private final TrainRepository trains;
  private final TrainStopRepository stops; private final SeatRepository seats; private final BookingRepository bookings; private final PaymentRepository payments;

  public Map<String, Object> dashboard() {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("users", users.count()); m.put("trains", trains.count()); m.put("stations", stations.count());
    m.put("bookings", bookings.count()); m.put("confirmed", bookings.countByStatus(Status.CONFIRMED));
    m.put("cancelled", bookings.countByStatus(Status.CANCELLED)); m.put("pendingPayments", bookings.countByStatus(Status.PENDING_PAYMENT));
    m.put("successfulPayments", payments.countByStatus("PAID") + payments.countByStatus("REFUND_PENDING"));
    m.put("refundsPending", payments.countByStatus("REFUND_PENDING"));
    m.put("revenue", payments.totalPaid().subtract(payments.totalRefunds()));
    return m;
  }

  public Station createStation(Station s) {
    s.setId(null); s.setCode(s.getCode().toUpperCase());
    if (stations.findByCode(s.getCode()).isPresent()) throw BookingService.conflict("Station code exists");
    return stations.save(s);
  }

  @Transactional
  public Train createTrain(TrainReq r) {
    if (r.stops() == null || r.stops().size() < 2) throw bad("A train needs at least 2 stops");
    Train t = new Train(); t.setNumber(r.number()); t.setName(r.name()); t.setFarePerStop(r.farePerStop()); t = trains.save(t);
    int i = 1;
    for (StopReq s : r.stops()) {
      Station st = stations.findByCode(s.code().toUpperCase()).orElseThrow(() -> bad("Unknown station " + s.code()));
      TrainStop ts = new TrainStop(); ts.setTrainId(t.getId()); ts.setStationId(st.getId()); ts.setStopOrder(i++); ts.setArrival(s.arrival()); ts.setDeparture(s.departure()); stops.save(ts);
    }
    for (var e : r.seats().entrySet())
      for (int n = 0; n < e.getValue(); n++) {
        Seat s = new Seat(); s.setTrainId(t.getId()); s.setClassType(e.getKey()); s.setCoach(e.getKey() + (n / 72 + 1)); s.setSeatNo(n % 72 + 1); seats.save(s);
      }
    return t;
  }
}
