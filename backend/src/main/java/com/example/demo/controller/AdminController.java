package com.example.demo.controller;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
  private final AdminService admin; private final UserRepository users; private final BookingRepository bookings; private final BookingService svc;
  @GetMapping("/dashboard") public Map<String, Object> dash() { return admin.dashboard(); }
  @GetMapping("/users") public List<Map<String, Object>> users() { return users.findAll().stream().map(u -> Map.<String, Object>of("id", u.getId(), "name", u.getName(), "email", u.getEmail(), "role", u.getRole())).toList(); }
  @GetMapping("/bookings") public List<Map<String, Object>> bookings() { return bookings.findAll().stream().map(svc::view).toList(); }
  @PostMapping("/stations") public Station station(@RequestBody Station s) { return admin.createStation(s); }
  @PostMapping("/trains") public Train train(@RequestBody AdminService.TrainReq r) { return admin.createTrain(r); }
}
