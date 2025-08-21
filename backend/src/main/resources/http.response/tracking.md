# 📦 Tracking API – Test Results

## 🔄 Endpoint: Start Tracking

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/tracking/start
- **Request Name**: Start Tracking

### 📤 Request Body (JSON)
```json
{
  "orderId": 1,
  "pickupTime": "07:33",
  "agentId": "8"
}
```

### 📤 Response Body (JSON) 
```json
{
    "trackingId": 1,
    "status": "started"
}
```
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Update Location

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/tracking/{trackingId}/location
- **Request Name**: Update Location

### 📤 Request Body (JSON)
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timestamp": "2025-08-02T16:00:00Z"
}
```
### 📤 Response Body (JSON)
```json
{
    "trackingId": 1,
    "status": "location updated"
}
```
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Get Timeline

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/tracking/{trackingId}/timeline
- **Request Name**: Get Timeline
 ### 📤 Response Body (JSON)
```json
{
    "trackingId": 1,
    "timeline": [
        {
            "location": {
                "latitude": 40.7128,
                "longitude": -74.006
            },
            "timeStamp": "2025-08-02T16:00:00Z",
            "status": "IN_TRANSIT"
        }
    ]
}
```
- **Response Status**: 200 OK


