package com.courier.app.orders.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@Setter
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
    private  Double packageLengthCm;
    private  Double  packageWidthCm;
    private  Double  packageHeightCm;
    private  Double packageWeightKg;
    private String deliveryPhone;
    private String    pickupDate;
    private String pickupTimeWindow;
    private String  specialInstructions;
    private Boolean isFragile ;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "#0.0")
    private Double declaredValue;
    private String assignedPartnerEmail;

    @Enumerated(EnumType.STRING)
    private PackageType packageType;
    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;
    @Enumerated(EnumType.STRING)
    private  DeliveryType  deliveryType;




    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.CREATED;
    }



}