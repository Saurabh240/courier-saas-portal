package com.courier.app.dashboard.controller;

import com.courier.app.dashboard.model.DashboardSummary;
import com.courier.app.dashboard.service.DashboardService;
import com.courier.app.orders.model.OrderResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Dashboard", description = "Admin/staff dashboard KPIs and reporting")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    @Autowired
    private DashboardService service;

    /**
     * Tenant-scoped KPI summary for the admin dashboard: order counts by status,
     * this month's revenue, delivery success rate, a 7-day order count series
     * (for a bar chart) and a per-status percentage breakdown (for a pie chart).
     */
    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(
            summary = "Get dashboard summary",
            description = "Returns tenant-scoped order KPIs (totals, status counts, revenue for the "
                    + "current month, delivery success rate), a 7-day order count series for a bar "
                    + "chart, and a per-status percentage breakdown for a pie chart. "
                    + "Accessible to ADMIN and STAFF roles only."
    )

    public DashboardSummary getSummary() {
        return service.getDashboardSummary();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(
            summary = "Get orders created within a date range",
            description = "Returns all orders (current tenant) with a createdAt date between "
                    + "start and end (inclusive). Defaults to the last 30 days if either "
                    + "parameter is omitted."
    )

    public List<OrderResponse> getOrdersBetween(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return service.CreatedAtBetween(start, end);
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(
            summary = "Export all orders to Excel",
            description = "Streams an .xlsx workbook containing all orders for the current tenant."
    )

    public void export(HttpServletResponse response) throws IOException {
        service.exportToExcel(response);
    }
}