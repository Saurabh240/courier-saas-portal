package com.courier.app.orders.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerEmail;
    private String senderName;
    private String receiverName;
    private String pickupAddress;
    private String deliveryAddress;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String assignedPartnerEmail;

    private LocalDateTime createdAt;

    private String deliveryProofPath;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.CREATED;
    }

    // Getters and Setters
}