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

}