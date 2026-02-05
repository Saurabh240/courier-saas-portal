package com.courier.app.tracking.entity;

import lombok.Data;

@Data
public class LatestLocationTimelineResponse {
    private double lat;
    private double lng;
    private String capturedAt;
    private String location;
}
