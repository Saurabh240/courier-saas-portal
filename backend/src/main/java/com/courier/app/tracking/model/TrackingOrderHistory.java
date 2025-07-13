package com.courier.app.tracking.model;

import lombok.Data;
import lombok.Setter;

import java.util.List;

@Data
public class TrackingOrderHistory {
     private Long orderId;
     private String status;
     private List<TrackingList> history;
}
