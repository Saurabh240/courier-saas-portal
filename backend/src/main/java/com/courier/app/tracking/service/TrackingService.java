package com.courier.app.tracking.service;

import com.courier.app.tracking.model.*;
import com.courier.app.tracking.repository.TrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TrackingService {

    @Autowired
    private TrackingRepository trackingRepository;

    public TrackingResponse addEntry(TrackingRequest request){
        TrackingEntry entry=new TrackingEntry();
        entry.setOrderId(request.orderId());
        entry.setStatus(request.status());
        entry.setLocation(request.location());
        return toResponse(trackingRepository.save(entry));
    }

    public TrackingOrderHistory getTrackingOrderHistory(Long orderId){

        List<TrackingList> trackingLists=getOrderTrackingHistory(orderId);
        String currentStatus=trackingLists.get(0).status();

        TrackingOrderHistory trackingOrderHistory=new TrackingOrderHistory();
        trackingOrderHistory.setOrderId(orderId);
        trackingOrderHistory.setStatus(currentStatus);
        trackingOrderHistory.setHistory(trackingLists);

        return trackingOrderHistory;
    }

    public List<TrackingList> getOrderTrackingHistory(Long orderId){
        List<TrackingResponse> trackingResponses=getHistory(orderId);
        List<TrackingList> trackingLists=new ArrayList<>();
        for(TrackingResponse trackingResponse:trackingResponses){
            TrackingList trackingList=new TrackingList(trackingResponse.timestamp(), trackingResponse.status());
            trackingLists.add(trackingList);
        }
        return trackingLists;
    }

    public List<TrackingResponse> getHistory(Long orderId) {
        return trackingRepository
                .findByOrderIdOrderByTimestampDesc(orderId)
                .stream().map(this::toResponse)
                .toList();
    }

    private TrackingEntry toTrackingEntry(TrackingResponse response){
        return new TrackingEntry(response.id(),response.orderId(),response.status(),response.location(),response.timestamp());
    }

    private TrackingList toTrackingList(TrackingEntry entry){
        return new TrackingList(entry.getTimestamp(), entry.getStatus());
    }

    private TrackingResponse toResponse(TrackingEntry entry){
        return new TrackingResponse(entry.getId(),entry.getOrderId(),
                entry.getStatus(),entry.getLocation(),entry.getTimestamp());
    }
}
