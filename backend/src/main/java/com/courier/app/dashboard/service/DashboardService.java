package com.courier.app.dashboard.service;

import com.courier.app.orders.model.OrderResponse;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import com.courier.app.dashboard.model.DashboardSummary;
import com.courier.app.orders.model.Order;
import com.courier.app.orders.model.OrderStatus;
import com.courier.app.orders.repository.OrderRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    public DashboardSummary getSummary() {
        LocalDate start = LocalDate.now().minusDays(30);
        LocalDate end = LocalDate.now();
        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> !o.getCreatedAt().isBefore(start.atStartOfDay()) &&
                        o.getCreatedAt().isBefore(end.plusDays(1).atStartOfDay()))
                .collect(Collectors.toList());
        long total = orders.size();
        long delivered = orders.stream().filter(o -> o.getStatus() == OrderStatus.DELIVERED).count();
        long inTransit = orders.stream().filter(o -> o.getStatus() == OrderStatus.IN_TRANSIT).count();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long createdToday = orders.stream()
                .filter(o -> o.getCreatedAt().isAfter(startOfDay))
                .count();
        Map<OrderStatus, Long> statusCountMap = new EnumMap<>(OrderStatus.class);
        for (OrderStatus status : OrderStatus.values()) {
            long count = orders.stream().filter(o -> o.getStatus() == status).count();
            statusCountMap.put(status, count);
        }
        return new DashboardSummary(total, delivered, inTransit, createdToday, statusCountMap);
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
