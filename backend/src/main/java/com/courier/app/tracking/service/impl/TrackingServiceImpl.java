package com.courier.app.tracking.service.impl;

import com.courier.app.tracking.dto.*;
import com.courier.app.tracking.entity.Tracking;
import com.courier.app.tracking.entity.TrackingLocation;
import com.courier.app.tracking.repository.TrackingLocationRepository;
import com.courier.app.tracking.repository.TrackingRepository;
import com.courier.app.tracking.service.TrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TrackingServiceImpl implements TrackingService {

    @Autowired
    private TrackingRepository trackingRepository;

    @Autowired
    private TrackingLocationRepository trackingLocationRepository;

    @Override
    public StartTrackingResponse startTracking(StartTrackingRequest request) {

        StartTrackingResponse startTrackingResponse=new StartTrackingResponse();
        startTrackingResponse.setStatus("started");

        Tracking tracking=new Tracking();
        tracking.setTrackingId(startTrackingResponse.getTrackingId());
        tracking.setStatus(startTrackingResponse.getStatus());
        tracking.setAgentId(request.getAgentId());
        tracking.setOrderId(request.getOrderId());
        tracking.setPickupTime(request.getPickupTime());
        Tracking savedTracking=trackingRepository.save(tracking);

        return startTrackingResponse;
    }

    @Override
    public UpdateLocationResponse updateLocation(String trackingId, UpdateLocationRequest request) {

        UpdateLocationResponse updateLocationResponse=new UpdateLocationResponse();
        updateLocationResponse.setTrackingId(trackingId);
        updateLocationResponse.setStatus("location updated");

        TrackingLocation trackingLocation=new TrackingLocation();
        trackingLocation.setTrackingId(trackingId);
        trackingLocation.setLatitude(request.getLatitude());
        trackingLocation.setLongitude(request.getLongitude());
        trackingLocation.setStatus("IN_TRANSIT");
        trackingLocation.setTimestamp(request.getTimestamp());
        TrackingLocation savedTrackingLocation=trackingLocationRepository.save(trackingLocation);

        return updateLocationResponse;
    }

    @Override
    public LocationTimelineResponse getTimeline(String trackingId) {
        List<TrackingLocation> trackingLocationList=trackingLocationRepository.findByTrackingIdOrderByTimestampAsc(trackingId);
        LocationTimelineResponse locationTimelineResponse=new LocationTimelineResponse();
        locationTimelineResponse.setTrackingId(trackingId);
        List<TimelineRecord> timeLine=new ArrayList<>();
        for(TrackingLocation trackingLocation:trackingLocationList){
            Location location=new Location(trackingLocation.getLatitude(),trackingLocation.getLongitude());
            String timeStamp=trackingLocation.getTimestamp();
            String status=trackingLocation.getStatus();
            TimelineRecord timelineRecord=new TimelineRecord(location,timeStamp,status);
            timeLine.add(timelineRecord);
        }
        return locationTimelineResponse;
    }
}
