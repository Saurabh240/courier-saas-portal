 OrderController API Documentation

Base URL: http://localhost:8080/api/orders


 1. Create Order

POST   http://localhost:8080/api/orders/api/orders  
Roles: ADMIN, STAFF, CUSTOMER

Creates a new delivery order.

Request Body:
{
"customerEmail": "Bindu@gmail.com",
"senderName": "Iyappan",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"packageType": "ENVELOPE",              
"packageWeightKg": 2.5,            
"packageLengthCm": 30.5,              
"packageWidthCm": 20.2,
"packageHeightCm": 15.57799,
"pickupPhone": "+91-9876543210",
"deliveryPhone": "+91-9988776655",

"pickupDate": "2025-06-24",         
"pickupTimeWindow": "10:00-12:00", 
"specialInstructions": "Handle with care",
"paymentMode": "ONLINE",              
"declaredValue": 1200.0,           
"isFragile": true,                
"deliveryType": "SAME_DAY"        
}

Response:

{
"id": 25,
"customerEmail": "Bindu@gmail.com",
"senderName": "Iyappan",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"packageType": "ENVELOPE",
"packageWeightKg": 2.5,
"packageLengthCm": 30.5,
"packageWidthCm": 20.2,
"packageHeightCm": 15.58,
"pickupPhone": "+91-9876543210",
"deliveryPhone": "+91-9988776655",
"pickupDate": "2025-06-24",
"pickupTimeWindow": "10:00-12:00",
"specialInstructions": "Handle with care",
"paymentMode": "ONLINE",
"declaredValue": 1200.0,
"isFragile": true,
"status": "PENDING",
"deliveryType": "SAME_DAY",
"invoiceStatus": null,
"assignedPartnerEmail": null,
"createdAt": "2025-08-17T15:22:17.8941381",
"deliveryProofPath": null
}

 2. Get All Orders

GET  http://localhost:8080/api/orders?page=1&size=10&status=DELIVERED  
Roles: ADMIN, STAFF

Fetch paginated list of orders. Optionally filter by status.

Query Parameters:
- page (default: 1)
- size (default: 25)
- status (optional): OrderStatus enum

Response: 

[
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
}
]

---

3. Update Order

PUT http://localhost:8080/api/orders/4  
Roles: ADMIN, STAFF, CUSTOMER

Update an order by ID.

Path Variable:
- id: Order ID

Request Body:
{
"senderName": "New ",
"receiverName": "old",
"packageWeightKg": 5.0,
"packageHeightCm": 25.0,
"isFragile": false
}

Response: 

{
"id": 4,
"customerEmail": "saicharan697@gmail.com@",
"senderName": "New ",
"receiverName": "old",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"packageType": "ENVELOPE",
"packageWeightKg": 5.0,
"packageLengthCm": 30.0,
"packageWidthCm": 20.0,
"packageHeightCm": 25.0,
"pickupPhone": "+91-9876543210",
"deliveryPhone": "+91-9988776655",
"pickupDate": "2025-06-24",
"pickupTimeWindow": "10:00-12:00",
"specialInstructions": "Handle with care",
"paymentMode": "COD",
"declaredValue": 1200.0,
"isFragile": false,
"status": "PENDING",
"deliveryType": "EXPRESS",
"invoiceStatus": null,
"assignedPartnerEmail": null,
"createdAt": "2025-06-29T14:28:23.550738",
"deliveryProofPath": null
}



 4. Get Orders for Customer

GET http://localhost:8080/api/orders/customer?email=saicharan697@gmail.com
Roles: CUSTOMER

Get orders for the customer based on email.

Query Parameter:
- email: Customer email

Response: 

[
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
}
]



 5. Get Orders for Delivery Partner

GET http://localhost:8080/api/orders/partner?email=vigneshwaran@gmail.com 
Roles: DELIVERY_PARTNER

Get orders assigned to a delivery partner.

Query Parameter:
- email: Partner email

Response: 

[
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
"orderId": 13,
"senderName": "balaji",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"paymentMode": "ONLINE",
"declaredValue": 1200.0,
"deliveryType": "SAME_DAY",
"status": "PENDING",
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
}
]



 6. Assign Partner

PUT http://localhost:8080/api/orders/10/assign?partnerEmail=Ganesh@gmail.com  
Roles: ADMIN, STAFF

Assign a delivery partner to the order.

Path Variable:
id: Order ID

Query Parameter:
- partnerEmail: Email of delivery partner

Response:

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



7.Update Order Status

PUT  http://localhost:8080/api/orders/10/status?status=DELIVERED
Roles: ADMIN, STAFF, DELIVERY_PARTNER

Update the status of an order.

Path Variable:
- id: Order ID

Query Parameter:
- status: OrderStatus enum

Response: 
{
"orderId": 10,
"senderName": "balaji",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"paymentMode": "ONLINE",
"declaredValue": 1200.0,
"deliveryType": "SAME_DAY",
"status": "DELIVERED",
"invoiceStatus": null
}



8. Upload Proof of Delivery

POST http://localhost:8080/api/orders/10/proof 
Roles: DELIVERY_PARTNER

Upload a proof of delivery image file.

Path Variable:
- id : Order ID

Form Parameter:
- file: Multipart file

Response:
{
"orderId": 10,
"senderName": "balaji",
"receiverName": "sai",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"paymentMode": "ONLINE",
"declaredValue": 1200.0,
"deliveryType": "SAME_DAY",
"status": "DELIVERED",
"invoiceStatus": null
}



9.Get Order by ID

GET http://localhost:8080/api/orders/4  
Roles: ADMIN, STAFF, DELIVERY_PARTNER

Get detailed information of a single order.

Path Variable:
- id: Order ID

Response: 
{
"id": 4,
"customerEmail": "saicharan697@gmail.com@",
"senderName": "New ",
"receiverName": "old",
"pickupAddress": "56, chennai, TN, 600001",
"deliveryAddress": "80 subramaniya nagar St, karakudi,TN ,600002",
"packageType": "ENVELOPE",
"packageWeightKg": 5.0,
"packageLengthCm": 30.0,
"packageWidthCm": 25.0,
"packageHeightCm": 20.0,
"pickupPhone": "+91-9988776655",
"deliveryPhone": "+91-9876543210",
"pickupDate": "2025-06-24",
"pickupTimeWindow": "10:00-12:00",
"specialInstructions": "Handle with care",
"paymentMode": "COD",
"declaredValue": 1200.0,
"isFragile": false,
"status": "PENDING",
"deliveryType": "EXPRESS",
"invoiceStatus": null,
"assignedPartnerEmail": null,
"createdAt": "2025-06-29T14:28:23.550738",
"deliveryProofPath": null
}

🔐 Notes:

1-For updating order, Customer can only update the order only when orderStatus ="PENDING".