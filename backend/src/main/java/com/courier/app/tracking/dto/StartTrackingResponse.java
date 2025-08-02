package com.courier.app.tracking.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
public class StartTrackingResponse {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private String trackingId;
    private String status;
}
