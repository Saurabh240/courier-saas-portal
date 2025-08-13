# 📦 Status API – Test Results

## 🔄 Endpoint: Update status

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/status
- **Request Name**: Update status

### 📤 Request Body (JSON)
```json
{
    "orderId":1,
    "status":"IN_TRANSIT",
    "comment":"Order has been picked-up from warehouse"
}
```

### 📤 Response Body (JSON) 
```json
{
    "id": 2,
    "orderId": 1,
    "status": "IN_TRANSIT",
    "comment": "Order has been picked-up from warehouse",
    "updatedBy": "navy@gmail.com",
    "timestamp": "2025-08-13T20:44:10.6441308"
}
```
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Status history

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/status/{orderId}
- **Request Name**: Login
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Audit log

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/status/{orderId}/audit
- **Request Name**: Audit log
- **Response Status**: 200 OK
