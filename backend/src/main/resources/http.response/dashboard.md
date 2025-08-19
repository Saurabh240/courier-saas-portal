# 📦 Dashboard API – Test Results

## 📈 Endpoint: Get Order Statistics

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/dashboard/stats
- **Request Name**: Get Order Statistics

### 📤 Response Body (JSON) 
```json
{ "totalOrders": 2, "delivered": 0, "inTransit": 0, "createdToday": 0, "statusCountMap": { "PENDING": 2, "PICKED_UP": 0, "IN_TRANSIT": 0, "DELIVERED": 0, "CANCELLED": 0 } }
```
- **Response Status**: 200 OK
----
## 📅 Endpoint: Get Orders Between Dates

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/dashboard?start=2025-06-22&end=2025-06-29
- **Request Name**: Get Orders Between Dates

### 📤 Response Body (JSON)
```json
[
{
"orderId": 4,
"senderName": "balaji",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"paymentMode": "COD",
"declaredValue": 1200.0,
"deliveryType": "EXPRESS",
"status": "PENDING",
"invoiceStatus": null
},
{
"orderId": 3,
"senderName": "Alice",
"receiverName": "Bob",
"pickupAddress": "123 A St, City, State, ZIP",
"deliveryAddress": "456 B St, City, State, ZIP",
"paymentMode": "COD",
"declaredValue": 0.0,
"deliveryType": "EXPRESS",
"status": "DELIVERED",
"invoiceStatus": null
},
{
"orderId": 5,
"senderName": "balaji",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"paymentMode": "COD",
"declaredValue": 1200.0,
"deliveryType": "EXPRESS",
"status": "DELIVERED",
"invoiceStatus": null
},
{
"orderId": 7,
"senderName": "balaji",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"paymentMode": "COD",
"declaredValue": 1200.0,
"deliveryType": "EXPRESS",
"status": "PENDING",
"invoiceStatus": null
},
{
"orderId": 9,
"senderName": "balaji",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"paymentMode": "COD",
"declaredValue": 1200.0,
"deliveryType": "EXPRESS",
"status": "PENDING",
"invoiceStatus": null
},
{
"orderId": 1,
"senderName": "Alice",
"receiverName": "Bob",
"pickupAddress": "123 A St, City, State, ZIP",
"deliveryAddress": "456 B St, City, State, ZIP",
"paymentMode": null,
"declaredValue": 87.0,
"deliveryType": null,
"status": "IN_TRANSIT",
"invoiceStatus": null
},
{
"orderId": 2,
"senderName": "Alice",
"receiverName": "Bob",
"pickupAddress": "123 A St, City, State, ZIP",
"deliveryAddress": "456 B St, City, State, ZIP",
"paymentMode": null,
"declaredValue": 12.0,
"deliveryType": null,
"status": "IN_TRANSIT",
"invoiceStatus": null
},
{
"orderId": 6,
"senderName": "balaji",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"paymentMode": "COD",
"declaredValue": 1200.0,
"deliveryType": "EXPRESS",
"status": "PENDING",
"invoiceStatus": null
},
{
"orderId": 8,
"senderName": "balaji",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"paymentMode": "COD",
"declaredValue": 1200.0,
"deliveryType": "EXPRESS",
"status": "PENDING",
"invoiceStatus": null
},
{
"orderId": 10,
"senderName": "balaji",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"paymentMode": "ONLINE",
"declaredValue": 1200.0,
"deliveryType": "SAME_DAY",
"status": "PENDING",
"invoiceStatus": null
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

