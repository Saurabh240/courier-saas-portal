package com.courier.app.tracking.dto;


import lombok.Data;

@Data
public class StartTrackingRequest {
    private Long orderId;
    private String pickupTime;
    private String agentId;
}
