package com.courier.app.dashboard.service;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import com.courier.app.dashboard.model.DailyOrderCount;
import com.courier.app.dashboard.model.DashboardSummary;
import com.courier.app.dashboard.model.StatusBreakdown;
import com.courier.app.dashboard.repository.DashboardRepository;
import com.courier.app.payment.model.PaymentStatus;
import com.courier.app.payment.repository.PaymentRepository;
import com.courier.app.orders.model.Order;
import com.courier.app.orders.model.OrderResponse;
import com.courier.app.orders.model.OrderStatus;
import com.courier.app.orders.repository.OrderRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final int WEEKLY_CHART_DAYS = 7;

    private final OrderRepository orderRepository;
    private final DashboardRepository dashboardRepository;
    private final PaymentRepository paymentRepository;

    /**
     * Builds the full dashboard summary for the currently resolved tenant:
     * order counts by status, this month's revenue, delivery success rate,
     * a 7-day order count series and a status breakdown for the pie chart.
     */
    public DashboardSummary getDashboardSummary() {

        // --- Status counts -------------------------------------------------
        Map<OrderStatus, Long> statusCounts = new EnumMap<>(OrderStatus.class);
        for (OrderStatus status : OrderStatus.values()) {
            statusCounts.put(status, 0L);
        }
        for (Object[] row : dashboardRepository.countOrdersGroupedByStatus()) {
            OrderStatus status = (OrderStatus) row[0];
            Long count = (Long) row[1];
            statusCounts.put(status, count);
        }

        long totalOrders = dashboardRepository.countAllOrders();
        long pendingOrders = statusCounts.getOrDefault(OrderStatus.PENDING, 0L);
        long inTransitOrders = statusCounts.getOrDefault(OrderStatus.IN_TRANSIT, 0L);
        long deliveredOrders = statusCounts.getOrDefault(OrderStatus.DELIVERED, 0L);
        long cancelledOrders = statusCounts.getOrDefault(OrderStatus.CANCELLED, 0L);

        // --- Delivery success rate -----------------------------------------
        double deliverySuccessRate = totalOrders == 0
                ? 0.0
                : round2((deliveredOrders * 100.0) / totalOrders);

        // --- Revenue for the current calendar month -------------------------
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now();
        Instant startOfMonth = today.withDayOfMonth(1).atStartOfDay(zone).toInstant();
        Instant startOfNextMonth = today.withDayOfMonth(1).plusMonths(1).atStartOfDay(zone).toInstant();

        Long revenuePaise = paymentRepository.sumAmountPaiseByStatusAndCreatedAtBetween(
                PaymentStatus.CAPTURED, startOfMonth, startOfNextMonth);
        BigDecimal revenueThisMonth = BigDecimal.valueOf(revenuePaise == null ? 0L : revenuePaise)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        // --- Weekly order counts (last 7 days, oldest first) ---------------
        LocalDate firstDay = today.minusDays(WEEKLY_CHART_DAYS - 1L);
        LocalDateTime since = firstDay.atStartOfDay();

        Map<LocalDate, Long> countsByDay = new HashMap<>();
        for (Object[] row : dashboardRepository.countOrdersByDaySince(since)) {
            LocalDate day = toLocalDate(row[0]);
            Long count = (Long) row[1];
            countsByDay.put(day, count);
        }

        List<DailyOrderCount> weeklyOrderCounts = new ArrayList<>(WEEKLY_CHART_DAYS);
        for (int i = 0; i < WEEKLY_CHART_DAYS; i++) {
            LocalDate day = firstDay.plusDays(i);
            weeklyOrderCounts.add(new DailyOrderCount(day, countsByDay.getOrDefault(day, 0L)));
        }

        // --- Status breakdown (counts + % share) for the pie chart ----------
        Map<OrderStatus, StatusBreakdown> statusBreakdown = new EnumMap<>(OrderStatus.class);
        for (OrderStatus status : OrderStatus.values()) {
            long count = statusCounts.getOrDefault(status, 0L);
            double percentage = totalOrders == 0 ? 0.0 : round2((count * 100.0) / totalOrders);
            statusBreakdown.put(status, new StatusBreakdown(count, percentage));
        }

        return new DashboardSummary(
                totalOrders,
                pendingOrders,
                inTransitOrders,
                deliveredOrders,
                cancelledOrders,
                revenueThisMonth,
                deliverySuccessRate,
                weeklyOrderCounts,
                statusBreakdown
        );
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    /**
     * The JPQL projection {@code CAST(o.createdAt AS date)} can be returned as either
     * {@link java.sql.Date} or {@link LocalDate} depending on the Hibernate/dialect
     * version, so handle both.
     */
    private LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate localDate) {
            return localDate;
        }
        if (value instanceof Date sqlDate) {
            return sqlDate.toLocalDate();
        }
        if (value instanceof java.util.Date utilDate) {
            return utilDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        throw new IllegalStateException("Unexpected date type returned from query: " + value.getClass());
    }

    public List<OrderResponse> CreatedAtBetween(LocalDate start, LocalDate end) {
        if (start == null || end == null) {
            end = LocalDate.now();
            start = end.minusDays(30);
        }
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.plusDays(1).atStartOfDay();

        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> !o.getCreatedAt().isBefore(startDateTime) &&
                        o.getCreatedAt().isBefore(endDateTime))
                .collect(Collectors.toList());

        return orders.stream().map(order -> new OrderResponse(
                order.getId(),
                order.getSenderName(),
                order.getReceiverName(),
                order.getPickupAddress(),
                order.getDeliveryAddress(),
                order.getPaymentMode(),
                order.getDeclaredValue(),
                order.getDeliveryType(),
                order.getStatus(),
                order.getInvoiceStatus(),
                order.getPickupGeo(),
                order.getDeliveryGeo()
        )).collect(Collectors.toList());
    }

    public void exportToExcel(HttpServletResponse response) throws IOException {
        List<Order> orders = orderRepository.findAll();
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Orders");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Invoice");
        header.createCell(1).setCellValue("Date");
        header.createCell(2).setCellValue("Sender");
        header.createCell(3).setCellValue("Pickup Address");
        header.createCell(4).setCellValue("Dropoff Address");
        header.createCell(5).setCellValue("Status");
        int rowIdx = 1;
        for (Order order : orders) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(order.getId());
            row.createCell(1).setCellValue(order.getCreatedAt().toString());
            row.createCell(2).setCellValue(order.getSenderName());
            row.createCell(3).setCellValue(order.getPickupAddress());
            row.createCell(4).setCellValue(order.getDeliveryAddress());
            row.createCell(5).setCellValue(order.getStatus().name());
        }
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");
        workbook.write(response.getOutputStream());
        workbook.close();
    }
}