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
    @Column(name = "customer_email")
    private String customerEmail;
    @Column(name = "sender_name")
    private String senderName;
    @Column(name = "receiver_name")
    private String receiverName;
    @Column(name = "pickup_address")
    private String pickupAddress;
    @Column(name = "delivery_address")
    private String deliveryAddress;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "delivery_proof_path")
    private String deliveryProofPath;
    @Column(name = "pickup_phone")
    private String pickupPhone;
    @Column(name = "package_length_cm")
    private double packageLengthCm;
    @Column(name = "package_width_cm")
    private double packageWidthCm;
    @Column(name = "package_height_cm")
    private double packageHeightCm;
    @Column(name = "package_weight_kg")
    private double packageWeightKg;
    @Column(name = "delivery_phone")
    private String deliveryPhone;
    @Column(name = "pickup_date")
    private String pickupDate;
    @Column(name = "pickup_time_window")
    private String pickupTimeWindow;
    @Column(name = "special_instructions")
    private String specialInstructions;
    @Column(name = "is_fragile")
    private boolean isFragile;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "#0.0")
    @Column(name = "declared_value")
    private double declaredValue;
    @Column(name = "assigned_partner_email")
    private String assignedPartnerEmail;
    @Enumerated(EnumType.STRING)
    @Column(name = "package_type")
    private PackageType packageType;
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode")
    private PaymentMode paymentMode;
    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_type")
    private DeliveryType deliveryType;
    @Enumerated(EnumType.STRING)
    @Column(name = "invoice_status")
    private InvoiceStatus invoiceStatus;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "lat", column = @Column(name = "pickup_lat")),
            @AttributeOverride(name = "lng", column = @Column(name = "pickup_lng")),
            @AttributeOverride(name = "city", column = @Column(name = "pickup_city")),
            @AttributeOverride(name = "postalCode", column = @Column(name = "pickup_postal_code")),
            @AttributeOverride(name = "formattedAddress", column = @Column(name = "pickup_formatted_address"))
    }
    )
    private GeoLocation pickupGeo;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "lat", column = @Column(name = "delivery_lat")),
            @AttributeOverride(name = "lng", column = @Column(name = "delivery_lng")),
            @AttributeOverride(name = "city", column = @Column(name = "delivery_city")),
            @AttributeOverride(name = "postalCode", column = @Column(name = "delivery_postal_code")),
            @AttributeOverride(name = "formattedAddress", column = @Column(name = "delivery_formatted_address"))
    }
    )
    private GeoLocation deliveryGeo;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.PENDING;
    }
}