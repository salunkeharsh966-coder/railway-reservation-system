package com.example.demo.config;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.AdminService;
import com.example.demo.service.AdminService.*;
import java.math.BigDecimal;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
  private final StationRepository stations; private final UserRepository users; private final AdminService admin; private final PasswordEncoder enc;
  @Override public void run(String... args) {
    if (users.findByEmail("admin@rail.com").isEmpty()) {
      User u = new User(); u.setName("Admin"); u.setEmail("admin@rail.com"); u.setPasswordHash(enc.encode("Admin@123")); u.setRole("ADMIN"); users.save(u);
    }
    if (stations.count() > 0) return;
    String[][] st = { {"TNA", "Thane", "Thane"}, {"KYN", "Kalyan", "Kalyan"}, {"LNL", "Lonavala", "Lonavala"}, {"TGN", "Talegaon", "Talegaon"}, {"PUNE", "Pune Junction", "Pune"} };
    for (String[] s : st) { Station x = new Station(); x.setCode(s[0]); x.setName(s[1]); x.setCity(s[2]); admin.createStation(x); }
    admin.createTrain(new TrainReq("11029", "Demo Express", new BigDecimal("60"),
      List.of(new StopReq("TNA", "08:30", "08:32"), new StopReq("KYN", "08:50", "08:52"), new StopReq("LNL", "10:30", "10:32"), new StopReq("TGN", "11:05", "11:07"), new StopReq("PUNE", "12:15", "12:15")),
      Map.of("SLEEPER", 40, "AC3", 20)));
  }
}
