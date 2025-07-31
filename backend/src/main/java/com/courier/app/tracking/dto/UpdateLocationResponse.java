package com.courier.app.tracking.dto;

import lombok.Data;

@Data
public class UpdateLocationResponse {
    private String trackingId;
    private String status;
}
