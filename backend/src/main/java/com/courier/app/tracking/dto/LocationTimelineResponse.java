package com.courier.app.tracking.dto;


import lombok.Data;
import java.util.List;

@Data
public class LocationTimelineResponse {
    private String trackingId;
    private List<TimelineEntry> timeline;

    @Data
    public static class TimelineEntry {
        private double latitude;
        private double longitude;
        private String timestamp;
        private String status;
    }
}
