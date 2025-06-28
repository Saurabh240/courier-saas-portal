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

    private String packageType;

    private  Integer packageWeightKg;
    private  Integer packageLengthCm;
    private  Integer  packageWidthCm;
    private  Integer  packageHeightCm;

    private String  pickupPhone;
    private String deliveryPhone;

    private String    pickupDate;
    private String pickupTimeWindow;
    private String  specialInstructions;

    private String paymentMode;

    private Boolean isFragile ;
    private String  deliveryType;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private Double declaredValue;
    private String assignedPartnerEmail;

    private LocalDateTime createdAt;

    private String deliveryProofPath;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.CREATED;
    }

    public Boolean getIsFragile() {
        return isFragile;
    }

    public void setIsFragile(Boolean isFragile) {
        this.isFragile = isFragile;
    }
    // Getters and Setters
}