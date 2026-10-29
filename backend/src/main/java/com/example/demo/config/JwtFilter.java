package com.example.demo.config;
import com.example.demo.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
public class JwtFilter extends OncePerRequestFilter {
  private final JwtService jwt;
  public JwtFilter(JwtService j) { this.jwt = j; }
  @Override protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
    String h = req.getHeader("Authorization");
    if (h != null && h.startsWith("Bearer ")) {
      try {
        Claims c = jwt.parse(h.substring(7));
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(Long.valueOf(c.getSubject()), null, List.of(new SimpleGrantedAuthority("ROLE_" + c.get("role", String.class)))));
      } catch (Exception ignored) { }
    }
    chain.doFilter(req, res);
  }
}
