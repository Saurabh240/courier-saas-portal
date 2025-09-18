package com.courier.app.tracking.service.impl;

import com.courier.app.tracking.dto.*;
import com.courier.app.tracking.entity.LatestLocationTimelineResponse;
import com.courier.app.tracking.entity.Tracking;
import com.courier.app.tracking.entity.TrackingLocation;
import com.courier.app.tracking.repository.TrackingLocationRepository;
import com.courier.app.tracking.repository.TrackingRepository;
import com.courier.app.tracking.service.TrackingService;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TrackingServiceImpl implements TrackingService {

    @Autowired
    private TrackingRepository trackingRepository;

    @Autowired
    private TrackingLocationRepository trackingLocationRepository;

    @Override
    public StartTrackingResponse startTracking(StartTrackingRequest request) {


        Tracking tracking=new Tracking();
        tracking.setStatus("started");
        tracking.setAgentId(request.getAgentId());
        tracking.setOrderId(request.getOrderId());
        tracking.setPickupTime(request.getPickupTime());
        Tracking savedTracking=trackingRepository.save(tracking);

        StartTrackingResponse startTrackingResponse=new StartTrackingResponse();
        startTrackingResponse.setTrackingId(tracking.getTrackingId());
        startTrackingResponse.setStatus(tracking.getStatus());


        return startTrackingResponse;
    }

    @Override
    public UpdateLocationResponse updateLocation(Long trackingId, UpdateLocationRequest request) {

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
    public LocationTimelineResponse getTimeline(Long trackingId) {

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

        locationTimelineResponse.setTimeline(timeLine);

        return locationTimelineResponse;
    }

    @Override
    public LatestLocationTimelineResponse getCurrentTimeline(Long trackingId){
        List<TrackingLocation> trackingLocationList=trackingLocationRepository.findByTrackingIdOrderByTimestampAsc(trackingId);
        TrackingLocation latestLocation=trackingLocationList.get(trackingLocationList.size()-1);
        LatestLocationTimelineResponse latestLocationTimelineResponse=new LatestLocationTimelineResponse();
        latestLocationTimelineResponse.setLat(latestLocation.getLatitude());
        latestLocationTimelineResponse.setLng(latestLocation.getLongitude());
        latestLocationTimelineResponse.setCapturedAt(latestLocation.getTimestamp());
        latestLocationTimelineResponse.setLocation(geoLocToAddress(latestLocation.getLatitude(), latestLocation.getLongitude()));
        return latestLocationTimelineResponse;
    }

    private String geoLocToAddress(double lat,double lng){
        String url="https://nominatim.openstreetmap.org/reverse?format=json&lat="
                + lat + "&lon=" + lng;
        try {
            URL obj=new URL(url);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent","Mozilla/5.0");

            BufferedReader input=new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response=new StringBuilder();
            String inputLine;
            while((inputLine=input.readLine())!=null){
                response.append(inputLine);
            }
            input.close();
            JsonObject json = JsonParser.parseString(response.toString()).getAsJsonObject();
            System.out.println(json.keySet());
            JsonObject address = json.getAsJsonObject("address");
            StringBuilder sb=new StringBuilder();
            for(Map.Entry<String, JsonElement> entry:address.entrySet()){
                if(sb.length()>0){
                    sb.append(", ");
                }
                sb.append(entry.getValue().getAsString());
            }
            return sb.toString();
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
