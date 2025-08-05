package com.courier.app.tracking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Tracking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trackingId;
    private Long orderId;
    private String agentId;
    private String status;
    private String pickupTime;
}
