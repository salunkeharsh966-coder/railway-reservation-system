package com.example.demo.controller;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.BookingService;
import java.time.LocalDate;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController @RequiredArgsConstructor
public class TrainController {
  private final TrainRepository trains; private final StationRepository stations; private final TrainStopRepository stops; private final BookingService svc;

  @GetMapping("/api/stations") public List<Station> stations() { return stations.findAll(); }
  @GetMapping("/api/trains") public List<Train> all() { return trains.findAll(); }
  @GetMapping("/api/trains/{id}") public Train one(@PathVariable Long id) { return trains.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Train not found")); }

  Station st(String code) { return stations.findByCode(code.toUpperCase()).orElseThrow(() -> BookingService.bad("Unknown station " + code)); }

  @GetMapping("/api/trains/search")
  public List<Map<String, Object>> search(@RequestParam String from, @RequestParam String to, @RequestParam LocalDate date, @RequestParam(defaultValue = "SLEEPER") String classType) {
    Station f = st(from), t = st(to); List<Map<String, Object>> out = new ArrayList<>();
    for (Long tid : stops.trainsBetween(f.getId(), t.getId())) {
      Train tr = trains.findById(tid).orElseThrow();
      TrainStop a = stops.findByTrainIdAndStationId(tid, f.getId()).orElseThrow(), b = stops.findByTrainIdAndStationId(tid, t.getId()).orElseThrow();
      out.add(Map.of("id", tid, "number", tr.getNumber(), "name", tr.getName(), "departure", a.getDeparture(), "arrival", b.getArrival(),
        "available", svc.availability(tid, from, to, date, classType), "fare", svc.fare(tr, classType, a.getStopOrder(), b.getStopOrder())));
    }
    return out;
  }

  @GetMapping("/api/trains/{id}/availability")
  public Map<String, Object> availability(@PathVariable Long id, @RequestParam String from, @RequestParam String to, @RequestParam LocalDate date, @RequestParam(defaultValue = "SLEEPER") String classType) {
    return Map.of("available", svc.availability(id, from, to, date, classType));
  }
}
