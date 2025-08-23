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
