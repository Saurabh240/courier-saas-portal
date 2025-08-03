package com.courier.app.tracking.dto;


import lombok.Data;
import java.util.List;

@Data
public class LocationTimelineResponse {
    private Long trackingId;
    private List<TimelineRecord> timeline;
}
