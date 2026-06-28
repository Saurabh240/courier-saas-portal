# 📦 UserManagement API – Test Results

## 🔄 Endpoint: Register User

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/users/register
- **Request Name**: Register User

### 📤 Request Body (JSON)
```json
{
    "name":"Navy",
    "email":"navy19@gmail.com",
    "password":"1234abcd",
    "phoneNo":"6379838273",
    "role":"ADMIN"
}
```

### 📤 Response Body (JSON) 
```json
{
    "id": 4,
    "name": "Navy",
    "email": "navy19@gmail.com",
    "phone": "6379838273",
    "role": "ADMIN"
}
```
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Login

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/users/login
- **Request Name**: Login

### 📤 Request Body (JSON)
```json
{
    "email":"navy19@gmail.com",
    "password":"1234abcd"
}
```
### 📤 Response Body (JSON)
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXZ5MTlAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzU0NzQzMzY5LCJleHAiOjE3NTQ4Mjk3Njl9.FLbpvWbSkjl2twxupNxIE9fDacXUiw0BpHdh2IvqPm4",
    "role": "ADMIN"
}
```
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Get all users

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/users
- **Request Name**: Get Timeline
  ### 📤 Response Body (JSON)
```json
[
    {
        "id": 1,
        "name": "Navy",
        "email": "navy@gmail.com",
        "phone": "5364783920",
        "role": "ADMIN"
    }
]
```
- **Response Status**: 200 OK


## 🔄 Endpoint: Forgot Password

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/users/forgot-password
- **Request Name**: forgot Password

### 📤 Request Body (JSON)
```json
{
  "email":"navy@gmail.com"
}
```
- **Response Status**: 200 OK

## 🔄 Endpoint: Reset Password

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/users/reset-password
- **Request Name**: reset Password

### 📤 Request Body (JSON)
```json
{
  "token": "6f8ce3b2-973d-4e15-8ae9-556a7c4062e6",
  "newPassword":"A123456@"
}
```
- **Response Status**: 200 OK


# 🔐 Admin User Management API – Test Results

> All endpoints below require `Authorization: Bearer <ADMIN_TOKEN>`. Non-admin or missing tokens are tested separately under Access Control cases.

## 🔄 Endpoint: Create Staff/Delivery Partner (Admin)

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/admin/users
- **Request Name**: Create Staff User


### 📤 Request Body (JSON)
```json
{
    "name": "Raj Kumar",
    "email": "raj.staff@gmail.com",
    "phoneNo": "+919876543210",
    "role": "STAFF"
}
```
### 📤 Response Body (JSON)
```json
{
    "id": 12,
    "name": "Raj Kumar",
    "email": "raj.staff@gmail.com",
    "phone": "+919876543210",
    "role": "STAFF",
    "verified": true
}
```
- **Response Status**: 201 Created
- **Notes**: Temporary password generated and emailed via `EmailService`

### ✅ TC2 —  Create DELIVERY_PARTNER

### 📤 Request Body (JSON)
```json
{
    "name": "Vikram Singh",
    "email": "vikram.delivery@gmail.com",
    "phoneNo": "+919876543220",
    "role": "DELIVERY_PARTNER"
}
```
- **Response Status**: 201 Created

----

### ❌ TC3 — Reject role=ADMIN

### 📤 Request Body (JSON)
```json
{
    "name": "Sneaky Admin",
    "email": "sneaky@gmail.com",
    "phoneNo": "+919876543211",
    "role": "ADMIN"
}
```
### 📤 Response Body (JSON)
```json
{
    "error": "Role must be either STAFF or DELIVERY_PARTNER"
}
```
- **Response Status**: 400 Bad Request

----

### ❌ TC4 — Duplicate Email

### 📤 Request Body (JSON)
```json
{
    "name": "Raj Kumar",
    "email": "raj.staff@gmail.com",
    "phoneNo": "+919876543210",
    "role": "STAFF"
}
```
### 📤 Response Body (JSON)
```json
{
    "error": "Email already exists"
}
```
- **Response Status**: 409 Conflict

----

## 🔄 Endpoint: List Users (Admin, Paginated)

### ✅ TC12 — List All, No Filter

- **Type**: GET
- **URL**: http://localhost:8080/api/admin/users?page=0

### 📤 Response Body (JSON)
```json
{
    "content": [
      {
        "id": 1,
        "name": "abhi garg",
        "email": "abhigarg5969@gmail.com",
        "phone": "09877509737",
        "role": "ADMIN",
        "verified": false
      },
      {
        "id": 2,
        "name": "Test Staff",
        "email": "gargabhi341@gmail.com",
        "phone": "+919876543210",
        "role": "STAFF",
        "verified": true
      },
      {
        "id": 3,
        "name": "Sneaky Admin",
        "email": "sneaky@gmail.com",
        "phone": "+919876543211",
        "role": "DELIVERY_PARTNER",
        "verified": true
      },
      {
        "id": 4,
        "name": "Sneaky Admin",
        "email": "sneakyq@gmail.com",
        "phone": null,
        "role": "STAFF",
        "verified": true
      },
      {
        "id": 5,
        "name": "Sneaky Admin",
        "email": "sneakya@gmail.com",
        "phone": "+91876543211",
        "role": "STAFF",
        "verified": true
      },
      {
        "id": 6,
        "name": "Sneaky Admin",
        "email": "sneakyaa@gmail.com",
        "phone": "+918765431",
        "role": "STAFF",
        "verified": true
      },
      {
        "id": 8,
        "name": "Sneaky Admin",
        "email": "sneakyqa11@gmail.com",
        "phone": "+918765431",
        "role": "STAFF",
        "verified": true
      },
      {
        "id": 7,
        "name": "Sneaky Admin",
        "email": "sneakyqaa@gmail.com",
        "phone": "8765431",
        "role": "STAFF",
        "verified": false
      },
      {
        "id": 9,
        "name": "Sneaky Admin",
        "email": "sneakyqaq11@gmail.com",
        "phone": "+918765431",
        "role": "STAFF",
        "verified": true
      },
      {
        "id": 10,
        "name": "Sneaky Admin",
        "email": "sneakyqaqqqqqq11@gmail.com",
        "phone": "+918765431",
        "role": "STAFF",
        "verified": true
      }
    ],
    "totalElements": 13,
    "totalPages": 1,
    "number": 0,
    "size": 20
}
```
- **Response Status**: 200 OK

----

### ✅ TC1 — Filter by role=STAFF

- **URL**: http://localhost:8080/api/admin/users?role=STAFF&page=0
- **Response Status**: 200 OK — `content` contains only STAFF users

----

### ✅ TC2 — Filter by role=DELIVERY_PARTNER

- **URL**: http://localhost:8080/api/admin/users?role=DELIVERY_PARTNER&page=0
- **Response Status**: 200 OK

----

### ❌ TC3 — Invalid Role Param

- **URL**: http://localhost:8080/api/admin/users?role=NOTAROLE&page=0
- **Response Status**: 400 Bad Request (enum binding failure)

----

## 🔄 Endpoint: Soft Delete User (Admin)

### ✅ TC18 — Happy Path: Soft Delete

- **Type**: DELETE
- **URL**: http://localhost:8080/api/admin/users/12
- **Response Status**: 204 No Content
- **DB Verification**:
```sql
SELECT id, email, verified FROM users WHERE id = 12;
-- row still exists, verified = false
```

----

### ⚠️ TC19 — Login After Soft Delete

### 📤 Request Body (JSON)
```json
{
    "email": "raj.staff@gmail.com",
    "password": "<their-password>"
}
```
- **Response Status**: 200 OK
----