# 📦 Dashboard API – Test Results

## 📈 Endpoint: Get Order Statistics

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/dashboard/stats
- **Request Name**: Get Order Statistics

### 📤 Response Body (JSON) 
```json
{
  "totalOrders": 8,
  "pendingOrders": 5,
  "inTransitOrders": 1,
  "deliveredOrders": 1,
  "cancelledOrders": 0,
  "revenueThisMonth": 0.00,
  "deliverySuccessRate": 12.5,
  "weeklyOrderCounts": [
    {
      "date": "2026-06-08",
      "count": 0
    },
    {
      "date": "2026-06-09",
      "count": 0
    },
    {
      "date": "2026-06-10",
      "count": 0
    },
    {
      "date": "2026-06-11",
      "count": 0
    },
    {
      "date": "2026-06-12",
      "count": 0
    },
    {
      "date": "2026-06-13",
      "count": 0
    },
    {
      "date": "2026-06-14",
      "count": 8
    }
  ],
  "statusBreakdown": {
    "PENDING": {
      "count": 5,
      "percentage": 62.5
    },
    "PICKED_UP": {
      "count": 1,
      "percentage": 12.5
    },
    "IN_TRANSIT": {
      "count": 1,
      "percentage": 12.5
    },
    "DELIVERED": {
      "count": 1,
      "percentage": 12.5
    },
    "CANCELLED": {
      "count": 0,
      "percentage": 0.0
    }
  }
}
```
- **Response Status**: 200 OK
----
## 📅 Endpoint: Get Orders Between Dates

### ✅ Request Details

- **Type**: GET
- **URL**: `{{baseUrl}}/api/dashboard?start=2025-06-24&end=2026-06-26`
- **Request Name**: Get Orders Between Dates

### 📤 Response Body (JSON)
```json
[
  {
    "orderId": 1,
    "senderName": "Iyappan",
    "receiverName": "sai",
    "pickupAddress": "56, chennai, TN, 600001",
    "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
    "paymentMode": "ONLINE",
    "declaredValue": 1200.0,
    "deliveryType": "SAME_DAY",
    "status": "PENDING",
    "invoiceStatus": null,
    "pickupGeo": null,
    "deliveryGeo": null
  },
  {
    "orderId": 5,
    "senderName": "jin",
    "receiverName": "you",
    "pickupAddress": "56, delhi, TN, 600001",
    "deliveryAddress": "80 gurgaon nagar St, karakudi,TN ,600002",
    "paymentMode": "ONLINE",
    "declaredValue": 1200.0,
    "deliveryType": "SAME_DAY",
    "status": "PENDING",
    "invoiceStatus": null,
    "pickupGeo": null,
    "deliveryGeo": null
  },
  {
    "orderId": 6,
    "senderName": "jin",
    "receiverName": "you",
    "pickupAddress": "56, delhi, TN, 600001",
    "deliveryAddress": "80 gurgaon nagar St, karakudi,TN ,600002",
    "paymentMode": "ONLINE",
    "declaredValue": 1200.0,
    "deliveryType": "SAME_DAY",
    "status": "PENDING",
    "invoiceStatus": null,
    "pickupGeo": null,
    "deliveryGeo": null
  },
  {
    "orderId": 7,
    "senderName": "jin",
    "receiverName": "you",
    "pickupAddress": "56, delhi, TN, 600001",
    "deliveryAddress": "80 gurgaon nagar St, karakudi,TN ,600002",
    "paymentMode": "ONLINE",
    "declaredValue": 1200.0,
    "deliveryType": "SAME_DAY",
    "status": "PENDING",
    "invoiceStatus": null,
    "pickupGeo": null,
    "deliveryGeo": null
  },
  {
    "orderId": 8,
    "senderName": "jin",
    "receiverName": "you",
    "pickupAddress": "56, delhi, TN, 600001",
    "deliveryAddress": "80 gurgaon nagar St, karakudi,TN ,600002",
    "paymentMode": "ONLINE",
    "declaredValue": 1200.0,
    "deliveryType": "SAME_DAY",
    "status": "PENDING",
    "invoiceStatus": null,
    "pickupGeo": null,
    "deliveryGeo": null
  },
  {
    "orderId": 2,
    "senderName": "rm",
    "receiverName": "you",
    "pickupAddress": "56, delhi, TN, 600001",
    "deliveryAddress": "80 gurgaon nagar St, karakudi,TN ,600002",
    "paymentMode": "ONLINE",
    "declaredValue": 1200.0,
    "deliveryType": "SAME_DAY",
    "status": "PICKED_UP",
    "invoiceStatus": null,
    "pickupGeo": null,
    "deliveryGeo": null
  },
  {
    "orderId": 3,
    "senderName": "jin",
    "receiverName": "you",
    "pickupAddress": "56, delhi, TN, 600001",
    "deliveryAddress": "80 gurgaon nagar St, karakudi,TN ,600002",
    "paymentMode": "ONLINE",
    "declaredValue": 1200.0,
    "deliveryType": "SAME_DAY",
    "status": "IN_TRANSIT",
    "invoiceStatus": null,
    "pickupGeo": null,
    "deliveryGeo": null
  },
  {
    "orderId": 4,
    "senderName": "jin",
    "receiverName": "you",
    "pickupAddress": "56, delhi, TN, 600001",
    "deliveryAddress": "80 gurgaon nagar St, karakudi,TN ,600002",
    "paymentMode": "ONLINE",
    "declaredValue": 1200.0,
    "deliveryType": "SAME_DAY",
    "status": "DELIVERED",
    "invoiceStatus": null,
    "pickupGeo": null,
    "deliveryGeo": null
  }
]
```
- **Response Status**: 200 OK
----
## 📤 Endpoint: Export Orders to Excel

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/dashboard/export
- **Request Name**: Export Orders to Excel
- **Response Status**: 200 OK

