package com.courier.app.tracking.dto;


import lombok.Data;

@Data
public class UpdateLocationRequest {
    private double latitude;
    private double longitude;
    private String timestamp;
}
