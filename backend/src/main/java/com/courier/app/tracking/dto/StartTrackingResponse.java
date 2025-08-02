package com.courier.app.tracking.dto;

import lombok.Data;

@Data
public class StartTrackingResponse {

    private Long trackingId;
    private String status;
}
