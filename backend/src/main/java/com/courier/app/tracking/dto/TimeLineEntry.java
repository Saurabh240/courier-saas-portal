package com.courier.app.tracking.dto;

import lombok.Data;

@Data
public class TimeLineEntry {
    private double latitude;
    private double longitude;
    private String timestamp;
    private String status;
}
