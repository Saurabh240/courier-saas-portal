package com.courier.app.tracking.dto;

import lombok.Data;

@Data
public class UpdateLocationResponse {
    private Long trackingId;
    private String status;
}
