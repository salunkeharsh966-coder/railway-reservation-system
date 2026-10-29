package com.example.demo.service;
import com.example.demo.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
public class JwtService {
  private final Key key;
  public JwtService(@Value("${app.jwt-secret}") String secret) { this.key = Keys.hmacShaKeyFor(secret.getBytes()); }
  public String make(User u) {
    return Jwts.builder().setSubject(String.valueOf(u.getId())).claim("role", u.getRole())
      .setExpiration(new Date(System.currentTimeMillis() + 86400000L)).signWith(key, SignatureAlgorithm.HS256).compact();
  }
  public Claims parse(String t) { return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(t).getBody(); }
}
