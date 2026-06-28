package com.courier.app.orders.repository;

import com.courier.app.orders.model.Order;
import com.courier.app.orders.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerEmail(String email);
    List<Order> findByAssignedPartnerEmail(String email);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    /** All tenant orders, unfiltered, newest first — used by STAFF list endpoint when no status given. */
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /** Orders assigned to a partner, optionally filtered by status — used by DELIVERY_PARTNER list endpoint. */
    Page<Order> findByAssignedPartnerEmailAndStatusOrderByCreatedAtDesc(
            String assignedPartnerEmail, OrderStatus status, Pageable pageable);

    /** Orders assigned to a partner, unfiltered, newest first. */
    Page<Order> findByAssignedPartnerEmailOrderByCreatedAtDesc(String assignedPartnerEmail, Pageable pageable);

    /** Orders for a customer, optionally filtered by status — used by CUSTOMER list endpoint. */
    Page<Order> findByCustomerEmailAndStatusOrderByCreatedAtDesc(
            String customerEmail, OrderStatus status, Pageable pageable);

    /** Orders for a customer, unfiltered, newest first. */
    Page<Order> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail, Pageable pageable);

}