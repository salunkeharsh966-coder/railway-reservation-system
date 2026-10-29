package com.example.demo.config;
import com.example.demo.service.JwtService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration @RequiredArgsConstructor
public class SecurityConfig {
  private final JwtService jwt;
  @Value("${app.cors-origin}") String origin;
  @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
  @Bean SecurityFilterChain chain(HttpSecurity http) throws Exception {
    http.csrf(c -> c.disable()).cors(Customizer.withDefaults())
      .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(a -> a
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/health", "/api/stations").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/trains/**", "/api/bookings/pnr/*").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN").anyRequest().authenticated())
      .exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
      .addFilterBefore(new JwtFilter(jwt), UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
  @Bean CorsConfigurationSource corsSource() {
    CorsConfiguration c = new CorsConfiguration(); c.setAllowedOrigins(List.of(origin.split(",")));
    c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); c.setAllowedHeaders(List.of("*"));
    UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource(); s.registerCorsConfiguration("/**", c); return s;
  }
}
