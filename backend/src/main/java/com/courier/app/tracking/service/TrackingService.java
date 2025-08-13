package com.courier.app.tracking.service;


import com.courier.app.tracking.dto.*;
import org.springframework.stereotype.Service;


public interface TrackingService {
    StartTrackingResponse startTracking(StartTrackingRequest request);
    UpdateLocationResponse updateLocation(Long trackingId, UpdateLocationRequest request);
    LocationTimelineResponse getTimeline(Long trackingId);
}
