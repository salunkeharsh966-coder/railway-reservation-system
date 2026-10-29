package com.example.railway.dto;

import lombok.*;

import java.math.BigDecimal;

/** Aggregated figures for the admin dashboard. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalUsers;
    private long totalTrains;
    private long totalBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private BigDecimal totalRevenue;
}
