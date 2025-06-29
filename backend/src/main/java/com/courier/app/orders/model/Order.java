package com.courier.app.orders.model;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    private LocalDateTime createdAt;
    private String deliveryProofPath;
    private String  pickupPhone;
    private  Integer packageLengthCm;
    private  Integer  packageWidthCm;
    private  Integer  packageHeightCm;
    private  Double packageWeightKg;
    private String packageType;
    private String paymentMode;
    private String deliveryPhone;





    private String    pickupDate;
    private String pickupTimeWindow;
    private String  specialInstructions;
    private String  deliveryType;


    private Boolean isFragile ;


    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "#0.0")
    private Double declaredValue;
    private String assignedPartnerEmail;





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