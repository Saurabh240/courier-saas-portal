📊 Dashboard API Documentation (Admin Portal)

🎯 Purpose
Provide authenticated admin users access to:
- View high-level order statistics
- View orders filtered by date range
- Export orders to Excel



1. 📈 Get Order Statistics

URL: 
GET http://localhost:8080/api/dashboard/stats


Access:
`ADMIN` only

Description:
Fetch aggregated statistics such as total orders, delivered,inTransit,createdToday,statusCountMap etc.

Response (200 OK):

json
{
  "totalOrders": 2,
  "delivered": 0,
  "inTransit": 0,
  "createdToday": 0,
  "statusCountMap": {
    "PENDING": 2,
    "PICKED_UP": 0,
    "IN_TRANSIT": 0,
    "DELIVERED": 0,
    "CANCELLED": 0
  }
}

 2. 📅 Get Orders Between Dates

URL: 
GET http://localhost:8080/api/dashboard?start=2025-06-22&end=2025-06-29

Access:
ADMIN only

Query Parameters:

- `start` (optional) — format: `YYYY-MM-DD`
- `end` (optional) — format: `YYYY-MM-DD`

Description: 
Get a list of orders created between the given start and end dates.

Example Request: 
GET http://localhost:8080/api/dashboard?start=2025-06-22&end=2025-06-29`

Response (200 OK):
json

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



 3. 📤 Export Orders to Excel

URL:
GET http://localhost:8080/api/dashboard/export

Access:
ADMIN only

Description: 
Exports the filtered order data to an Excel file.

Response:
- Content-Type: `application/vnd.ms-excel`
- Content-Disposition: `attachment; filename="orders.xlsx"`

The Excel file will contain order data with columns like Invoice No, Status, Created At, etc.



 🔐 Notes
- All endpoints require authentication and ADMIN role.
- Dates must follow ISO format: `YYYY-MM-DD`.