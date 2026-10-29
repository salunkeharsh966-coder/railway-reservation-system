package com.example.railway.controller;

import com.example.railway.dto.BookingResponse;
import com.example.railway.dto.DashboardStats;
import com.example.railway.dto.MessageResponse;
import com.example.railway.dto.UserResponse;
import com.example.railway.service.BookingService;
import com.example.railway.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin endpoints: dashboard, user management and booking management.
 *
 * GET    /api/admin/dashboard
 * GET    /api/admin/users
 * DELETE /api/admin/users/{id}
 * GET    /api/admin/bookings
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final BookingService bookingService;

    public AdminController(UserService userService, BookingService bookingService) {
        this.userService = userService;
        this.bookingService = bookingService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> dashboard() {
        return ResponseEntity.ok(bookingService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}
