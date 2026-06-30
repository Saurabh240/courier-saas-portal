# 📦 Orders API – Test Results

## 🔄 Endpoint: Create Order

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/orders
- **Request Name**: Create Order

### 📤 Request Body (JSON)
```json
{ "customerEmail": "Bindu@gmail.com", "senderName": "Iyappan", "receiverName": "sai", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "packageType": "ENVELOPE",
"packageWeightKg": 2.5,
"packageLengthCm": 30.5,
"packageWidthCm": 20.2, "packageHeightCm": 15.57799, "pickupPhone": "+91-9876543210", "deliveryPhone": "+91-9988776655",
"pickupDate": "2025-06-24",
"pickupTimeWindow": "10:00-12:00", "specialInstructions": "Handle with care", "paymentMode": "ONLINE",
"declaredValue": 1200.0,
"isFragile": true,
"deliveryType": "SAME_DAY"
}
```

### 📤 Response Body (JSON) 
```json
{ "id": 25, "customerEmail": "Bindu@gmail.com", "senderName": "Iyappan", "receiverName": "sai", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "packageType": "ENVELOPE", "packageWeightKg": 2.5, "packageLengthCm": 30.5, "packageWidthCm": 20.2, "packageHeightCm": 15.58, "pickupPhone": "+91-9876543210", "deliveryPhone": "+91-9988776655", "pickupDate": "2025-06-24", "pickupTimeWindow": "10:00-12:00", "specialInstructions": "Handle with care", "paymentMode": "ONLINE", "declaredValue": 1200.0, "isFragile": true, "status": "PENDING", "deliveryType": "SAME_DAY", "invoiceStatus": null, "assignedPartnerEmail": null, "createdAt": "2025-08-17T15:22:17.8941381", "deliveryProofPath": null }
```
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Get all orders

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/orders?page=1&size=10&status=DELIVERED
- **Request Name**: Get all orders
  ### 📤 Response Body (JSON) 
```json
[ { "orderId": 3, "senderName": "Alice", "receiverName": "Bob", "pickupAddress": "123 A St, City, State, ZIP", "deliveryAddress": "456 B St, City, State, ZIP", "paymentMode": "COD", "declaredValue": 0.0, "deliveryType": "EXPRESS", "status": "DELIVERED", "invoiceStatus": null }, { "orderId": 5, "senderName": "balaji", "receiverName": "sai", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "paymentMode": "COD", "declaredValue": 1200.0, "deliveryType": "EXPRESS", "status": "DELIVERED", "invoiceStatus": null } ]
```
- **Response Status**: 200 OK
----

## 🔄 Endpoint: Get Orders for Staff (role-scoped, paginated)

### ✅ Request Details

- **Type**: GET
- **URL**: `{{baseUrl}}/api/orders/staff?status=PENDING&page=0&size=20`
- **Request Name**: Get all orders
  ### 📤 Response Body (JSON)
```json
{
  "orders": [
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
    }
  ],
  "page": 0,
  "size": 20,
  "totalCount": 5,
  "totalPages": 1
}
```
- **Response Status**: 200 OK
----

## 🔄 Endpoint: Get Orders for Delivery Partner (role-scoped, paginated)

### ✅ Request Details

- **Type**: GET
- **URL**: `{{baseUrl}}/api/orders/staff?status=PENDING&page=0&size=20`
- **Request Name**: Get all orders
  ### 📤 Response Body (JSON)
```json
{
  "orders": [],
  "page": 0,
  "size": 20,
  "totalCount": 0,
  "totalPages": 0
}
```
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Get Orders for Customer (role-scoped, paginated)

### ✅ Request Details

- **Type**: GET
- **URL**: `{{baseUrl}}/api/orders/customer?status=IN_TRANSIT&page=0&size=20`
- **Request Name**: Get all orders
  ### 📤 Response Body (JSON)
```json
{
  "orders": [
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
    }
  ],
  "page": 0,
  "size": 20,
  "totalCount": 1,
  "totalPages": 1
}
```
- **Response Status**: 200 OK
----

## 🔄 Endpoint: Update order

### ✅ Request Details

- **Type**: PUT
- **URL**: http://localhost:8080/api/orders/{orderId}
- **Request Name**: Update order
  ### 📤 Request Body (JSON)
```json
{ "senderName": "New ", "receiverName": "old", "packageWeightKg": 5.0, "packageHeightCm": 25.0, "isFragile": false }
```
 ### 📤 Response Body (JSON) 
```json
{ "id": 4, "customerEmail": "saicharan697@gmail.com@", "senderName": "New ", "receiverName": "old", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "packageType": "ENVELOPE", "packageWeightKg": 5.0, "packageLengthCm": 30.0, "packageWidthCm": 20.0, "packageHeightCm": 25.0, "pickupPhone": "+91-9876543210", "deliveryPhone": "+91-9988776655", "pickupDate": "2025-06-24", "pickupTimeWindow": "10:00-12:00", "specialInstructions": "Handle with care", "paymentMode": "COD", "declaredValue": 1200.0, "isFragile": false, "status": "PENDING", "deliveryType": "EXPRESS", "invoiceStatus": null, "assignedPartnerEmail": null, "createdAt": "2025-06-29T14:28:23.550738", "deliveryProofPath": null }
```
- **Response Status**: 200 OK
- ----
## 🔄 Endpoint: Get Orders for Customer

### ✅ Request Details

- **Type**: GET
- **URL**:  http://localhost:8080/api/orders/customer?email=saicharan697@gmail.com
- **Request Name**: Get Orders for Customer

 ### 📤 Response Body (JSON) 
```json
[ { "orderId": 3, "senderName": "Alice", "receiverName": "Bob", "pickupAddress": "123 A St, City, State, ZIP", "deliveryAddress": "456 B St, City, State, ZIP", "paymentMode": "COD", "declaredValue": 0.0, "deliveryType": "EXPRESS", "status": "DELIVERED", "invoiceStatus": null }, { "orderId": 1, "senderName": "Alice", "receiverName": "Bob", "pickupAddress": "123 A St, City, State, ZIP", "deliveryAddress": "456 B St, City, State, ZIP", "paymentMode": null, "declaredValue": 87.0, "deliveryType": null, "status": "IN_TRANSIT", "invoiceStatus": null }, { "orderId": 2, "senderName": "Alice", "receiverName": "Bob", "pickupAddress": "123 A St, City, State, ZIP", "deliveryAddress": "456 B St, City, State, ZIP", "paymentMode": null, "declaredValue": 12.0, "deliveryType": null, "status": "IN_TRANSIT", "invoiceStatus": null } ]
```
- **Response Status**: 200 OK
- - ----
## 🔄 Endpoint: Get Orders for Delivery Partner

### ✅ Request Details

- **Type**: GET
- **URL**:   http://localhost:8080/api/orders/partner?email=vigneshwaran@gmail.com
- **Request Name**: Get Orders for Delivery Partner

 ### 📤 Response Body (JSON) 
```json
[ { "orderId": 3, "senderName": "Alice", "receiverName": "Bob", "pickupAddress": "123 A St, City, State, ZIP", "deliveryAddress": "456 B St, City, State, ZIP", "paymentMode": "COD", "declaredValue": 0.0, "deliveryType": "EXPRESS", "status": "DELIVERED", "invoiceStatus": null }, { "orderId": 5, "senderName": "balaji", "receiverName": "sai", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "paymentMode": "COD", "declaredValue": 1200.0, "deliveryType": "EXPRESS", "status": "DELIVERED", "invoiceStatus": null }, { "orderId": 1, "senderName": "Alice", "receiverName": "Bob", "pickupAddress": "123 A St, City, State, ZIP", "deliveryAddress": "456 B St, City, State, ZIP", "paymentMode": null, "declaredValue": 87.0, "deliveryType": null, "status": "IN_TRANSIT", "invoiceStatus": null }, { "orderId": 2, "senderName": "Alice", "receiverName": "Bob", "pickupAddress": "123 A St, City, State, ZIP", "deliveryAddress": "456 B St, City, State, ZIP", "paymentMode": null, "declaredValue": 12.0, "deliveryType": null, "status": "IN_TRANSIT", "invoiceStatus": null }, { "orderId": 13, "senderName": "balaji", "receiverName": "sai", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "paymentMode": "ONLINE", "declaredValue": 1200.0, "deliveryType": "SAME_DAY", "status": "PENDING", "invoiceStatus": null }, { "orderId": 6, "senderName": "balaji", "receiverName": "sai", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "paymentMode": "COD", "declaredValue": 1200.0, "deliveryType": "EXPRESS", "status": "PENDING", "invoiceStatus": null } ]
```
- **Response Status**: 200 OK
- ----
## 🔄 Endpoint: Assign Partner

### ✅ Request Details

- **Type**: PUT
- **URL**:  http://localhost:8080/api/orders/{orderId}/assign?partnerEmail=Ganesh@gmail.com
- **Request Name**: Assign Partner

 ### 📤 Response Body (JSON) 
```json
{ "orderId": 10, "senderName": "balaji", "receiverName": "sai", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "paymentMode": "ONLINE", "declaredValue": 1200.0, "deliveryType": "SAME_DAY", "status": "PENDING", "invoiceStatus": null }
```
- **Response Status**: 200 OK
- - ----
## 🔄 Endpoint: Update Order Status

### ✅ Request Details

- **Type**: PUT
- **URL**:  http://localhost:8080/api/orders/{orderId}/assign?partnerEmail=Ganesh@gmail.com
- **Request Name**: Update Order Status

 ### 📤 Response Body (JSON) 
```json
{ "orderId": 10, "senderName": "balaji", "receiverName": "sai", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "paymentMode": "ONLINE", "declaredValue": 1200.0, "deliveryType": "SAME_DAY", "status": "DELIVERED", "invoiceStatus": null }
```
- **Response Status**: 200 OK
-----
## 🔄 Endpoint: Upload proof of delivery

### ✅ Request Details

- **Type**: POST
- **URL**:  http://localhost:8080/api/orders/{orderId}/proof 
- **Request Name**: Upload proof of delivery


### 📤 Response Body (JSON) 
```json
{ "orderId": 10, "senderName": "balaji", "receiverName": "sai", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "paymentMode": "ONLINE", "declaredValue": 1200.0, "deliveryType": "SAME_DAY", "status": "DELIVERED", "invoiceStatus": null }
```
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Get order by ID

### ✅ Request Details

- **Type**: GET
- **URL**:  http://localhost:8080/api/orders/{orderId}
- **Request Name**: Get order by ID


### 📤 Response Body (JSON) 
```json
{ "id": 4, "customerEmail": "saicharan697@gmail.com@", "senderName": "New ", "receiverName": "old", "pickupAddress": "56, chennai, TN, 600001", "deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002", "packageType": "ENVELOPE", "packageWeightKg": 5.0, "packageLengthCm": 30.0, "packageWidthCm": 25.0, "packageHeightCm": 20.0, "pickupPhone": "+91-9988776655", "deliveryPhone": "+91-9876543210", "pickupDate": "2025-06-24", "pickupTimeWindow": "10:00-12:00", "specialInstructions": "Handle with care", "paymentMode": "COD", "declaredValue": 1200.0, "isFragile": false, "status": "PENDING", "deliveryType": "EXPRESS", "invoiceStatus": null, "assignedPartnerEmail": null, "createdAt": "2025-06-29T14:28:23.550738", "deliveryProofPath": null }
```
- **Response Status**: 200 OK
