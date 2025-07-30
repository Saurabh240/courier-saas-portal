package com.courier.app.tracking.dto;


import lombok.Data;
import java.util.List;

@Data
public class LocationTimelineResponse {
    private String trackingId;
    private List<TimeLineEntry> timeline;
}
