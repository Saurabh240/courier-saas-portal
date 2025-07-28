package com.courier.app.tracking.controller;

import com.courier.app.tracking.dto.*;
import com.courier.app.tracking.service.TrackingService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
@AllArgsConstructor
public class TrackingController {

    @Autowired
    private TrackingService trackingService;

    @PostMapping("/start")
    public ResponseEntity<StartTrackingResponse> startTracking(@RequestBody StartTrackingRequest request) {
        return ResponseEntity.ok(trackingService.startTracking(request));
    }

    @PostMapping("/{trackingId}/location")
    public ResponseEntity<UpdateLocationResponse> updateLocation(@PathVariable String trackingId, @RequestBody UpdateLocationRequest request) {
        return ResponseEntity.ok(trackingService.updateLocation(trackingId, request));
    }


    @GetMapping("/{trackingId}/timeline")
    public ResponseEntity<LocationTimelineResponse> getTimeline(@PathVariable String trackingId) {
        return ResponseEntity.ok(trackingService.getTimeline(trackingId));
    }
}