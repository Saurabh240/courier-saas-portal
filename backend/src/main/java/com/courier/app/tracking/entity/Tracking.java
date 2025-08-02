package com.courier.app.tracking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Tracking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String trackingId;
    private String orderId;
    private String agentId;
    private String status;
    private String pickupTime;
}
