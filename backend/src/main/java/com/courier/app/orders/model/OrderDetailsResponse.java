package com.courier.app.orders.model;

public class OrderDetailsResponse {
    private Long id;
    private String senderName;
    private String receiverName;
    private String status;
    private String assignedPartnerEmail;

    public OrderDetailsResponse(Long id, String senderName, String receiverName, String status, String assignedPartnerEmail) {
        this.id = id;
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.status = status;
        this.assignedPartnerEmail = assignedPartnerEmail;
    }

    public Long getId() {
        return id;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getStatus() {
        return status;
    }

    public String getAssignedPartnerEmail() {
        return assignedPartnerEmail;
    }
}
