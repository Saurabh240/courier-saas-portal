package com.courier.app.tracking.controller;

import com.courier.app.tracking.model.TrackingOrderHistory;
import com.courier.app.tracking.model.TrackingRequest;
import com.courier.app.tracking.model.TrackingResponse;
import com.courier.app.tracking.service.TrackingService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    @Autowired
    private TrackingService trackingService;

    @PostMapping
    public TrackingResponse add(@RequestBody TrackingRequest request) {
        return trackingService.addEntry(request);
    }

    @GetMapping("/{orderId}")
    public TrackingOrderHistory history(@PathVariable Long orderId) {
        return trackingService.getTrackingOrderHistory(orderId);
    }

}
