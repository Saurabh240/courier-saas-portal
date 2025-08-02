package com.courier.app.tracking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class TrackingLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long trackingId;
    private double latitude;
    private double longitude;
    private String timestamp;
    private String status;
}
