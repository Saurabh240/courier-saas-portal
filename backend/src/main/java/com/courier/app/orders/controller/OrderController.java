package com.courier.app.orders.controller;

import com.courier.app.orders.model.OrderRequest;
import com.courier.app.orders.model.OrderResponse;
import com.courier.app.orders.model.OrderStatus;
import com.courier.app.orders.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public OrderResponse create(@RequestBody OrderRequest request) {
        return service.createOrder(request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<OrderResponse> all(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "25") int size
    ) {
        return service.getAllOrders(page, size);
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<OrderResponse> forCustomer(@RequestParam String email) {
        return service.getOrdersForCustomer(email);
    }

    @GetMapping("/partner")
    @PreAuthorize("hasRole('DELIVERY_PARTNER')")
    public List<OrderResponse> forPartner(@RequestParam String email) {
        return service.getOrdersForPartner(email);
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public OrderResponse assignPartner(@PathVariable Long id, @RequestParam String partnerEmail) {
        return service.assignPartner(id, partnerEmail);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'DELIVERY_PARTNER')")
    public OrderResponse updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return service.updateStatus(id, status);
    }

    @PostMapping("/{id}/proof")
    @PreAuthorize("hasRole('DELIVERY_PARTNER')")
    public ResponseEntity<OrderResponse> uploadProof(@PathVariable Long id, @RequestParam MultipartFile file) throws IOException {
        OrderResponse updated = service.uploadProof(id, file);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER', 'DELIVERY_PARTNER')")
    public ResponseEntity<OrderResponse> getById(@PathVariable Long id) {
        OrderResponse order = service.getOrderById(id);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}
