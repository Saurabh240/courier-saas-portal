package com.courier.app.orders.controller;

import com.courier.app.orders.model.*;
import com.courier.app.orders.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order creation, listing and lifecycle management")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public OrderDetailsResponse create(@RequestBody OrderRequest request) {
        return service.createOrder(request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<OrderResponse> all(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "25") int size,
            @RequestParam(required = false) OrderStatus status
    ) {
        return service.getAllOrders(page, size,status);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public OrderDetailsResponse updateOrder(@PathVariable Long id, @RequestBody OrderUpdateRequest request) {
        return service.updateOrder(id, request);
    }

    /**
     * All tenant orders, optionally filtered by status. STAFF role only.
     * Page is 0-based (page=0 is the first page).
     */
    @GetMapping("/staff")
    @PreAuthorize("hasRole('STAFF')")
    @Operation(
            summary = "List orders for staff",
            description = "Returns all orders for the current tenant, optionally filtered by status. "
                    + "Supports pagination via page (0-based) and size. STAFF role only."
    )

    public PagedOrderResponse forStaff(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) OrderStatus status
    ) {
        return service.getOrdersForStaff(page, size, status);
    }

    /**
     * Orders assigned to the authenticated delivery partner, optionally filtered by status.
     * The partner's identity is taken from the authenticated JWT (not a client-supplied param),
     * so a partner cannot view another partner's orders.
     */
    @GetMapping("/partner")
    @PreAuthorize("hasRole('DELIVERY_PARTNER')")
    @Operation(
            summary = "List orders for the authenticated delivery partner",
            description = "Returns orders assigned to the authenticated delivery partner, optionally "
                    + "filtered by status. Supports pagination via page (0-based) and size. "
                    + "DELIVERY_PARTNER role only; the partner identity is derived from the JWT."
    )

    public PagedOrderResponse forPartner(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) OrderStatus status,
            Authentication authentication
    ) {
        String partnerEmail = authentication.getName();
        return service.getOrdersForPartnerPaged(page, size, status, partnerEmail);
    }

    /**
     * Orders belonging to the authenticated customer, optionally filtered by status.
     * The customer's identity is taken from the authenticated JWT (not a client-supplied param),
     * so a customer cannot view another customer's orders.
     */
    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(
            summary = "List orders for the authenticated customer",
            description = "Returns orders belonging to the authenticated customer, optionally filtered "
                    + "by status. Supports pagination via page (0-based) and size. "
                    + "CUSTOMER role only; the customer identity is derived from the JWT."
    )

    public PagedOrderResponse forCustomer(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) OrderStatus status,
            Authentication authentication
    ) {
        String customerEmail = authentication.getName();
        return service.getOrdersForCustomerPaged(page, size, status, customerEmail);
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
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'DELIVERY_PARTNER')")
    public ResponseEntity<OrderDetailsResponse> getOrderById(@PathVariable Long id) {
        OrderDetailsResponse response = service.getOrderById(id);
        return ResponseEntity.ok(response);
    }


}