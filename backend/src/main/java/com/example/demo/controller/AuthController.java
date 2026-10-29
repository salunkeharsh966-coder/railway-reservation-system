package com.example.demo.controller;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
  public record RegReq(String name, String email, String password) {}
  public record LoginReq(String email, String password) {}
  private final UserRepository users; private final PasswordEncoder enc; private final JwtService jwt;

  Map<String, Object> out(User u) { return Map.of("token", jwt.make(u), "name", u.getName(), "email", u.getEmail(), "role", u.getRole()); }

  @PostMapping("/register")
  public Map<String, Object> register(@RequestBody RegReq r) {
    if (r.name() == null || r.name().isBlank() || r.email() == null || !r.email().contains("@") || r.password() == null || r.password().length() < 8)
      throw BookingService.bad("Name, valid email and password (8+ chars) required");
    String em = r.email().trim().toLowerCase();
    if (users.findByEmail(em).isPresent()) throw BookingService.conflict("Email already registered");
    User u = new User(); u.setName(r.name().trim()); u.setEmail(em); u.setPasswordHash(enc.encode(r.password())); u.setRole("USER");
    return out(users.save(u));
  }

  @PostMapping("/login")
  public Map<String, Object> login(@RequestBody LoginReq r) {
    User u = users.findByEmail(r.email() == null ? "" : r.email().trim().toLowerCase()).orElse(null);
    if (u == null || !enc.matches(r.password() == null ? "" : r.password(), u.getPasswordHash()))
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    return out(u);
  }

  @GetMapping("/me")
  public Map<String, Object> me(Authentication a) {
    User u = users.findById((Long) a.getPrincipal()).orElseThrow();
    return Map.of("name", u.getName(), "email", u.getEmail(), "role", u.getRole());
  }
}
