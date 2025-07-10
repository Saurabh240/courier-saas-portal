package com.courier.app.dashboard.controller;
import com.courier.app.dashboard.model.DashboardSummary;
import com.courier.app.dashboard.service.DashboardService;
import com.courier.app.orders.model.OrderDetailsResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService service;


    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardSummary getOrderStats() {
        return service.getSummary();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderDetailsResponse> getOrdersBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return service.findByCreatedAtBetween(start, end);
    }
    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    public void export(HttpServletResponse response) throws IOException {
        service.exportToExcel(response);
    }
}