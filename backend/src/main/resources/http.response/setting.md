# 📦 Tenant Settings API – Test Results

## 🔄 Endpoint: Create new settings

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/admin/settings
- **Request Name**: Create new settings

### 📤 Request Body (JSON)
```json
{ "businessHours": { "mon": "10-19", "tue": "10-19", "wed": "10-19", "thu": "10-19", "fri": "10-19", "sat": "11-15", "sun": "closed" }, "brandName": "Sai logistics", "logoUrl": "https://cdn.example.com/logos/updated.png", "primaryColor": "#123456", "secondaryColor": "#654321", "timezone": "Asia/Kolkata" }
```

### 📤 Response Body (JSON) 
```json
{ "businessHours": { "mon": "10-19", "tue": "10-19", "wed": "10-19", "thu": "10-19", "fri": "10-19", "sat": "11-15", "sun": "closed" }, "brandName": "Sai logistics", "logoUrl": "https://cdn.example.com/logos/updated.png", "primaryColor": "#123456", "secondaryColor": "#654321", "timezone": "Asia/Kolkata" }
```
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Fetch current tenant settings

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/admin/settings
- **Request Name**: Fetch current tenant settings
  ### 📤 Response Body (JSON) 
```json
{ "businessHours": { "mon": "10-19", "tue": "10-19", "wed": "10-19", "thu": "10-19", "fri": "10-19", "sat": "11-15", "sun": "closed" }, "brandName": "Sai logistics", "logoUrl": "https://cdn.example.com/logos/updated.png", "primaryColor": "#123456", "secondaryColor": "#654321", "timezone": "Asia/Kolkata" }
```
- **Response Status**: 200 OK
----
## 🔄 Endpoint: Update existing settings

### ✅ Request Details

- **Type**: PUT
- **URL**: http://localhost:8080/api/admin/settings
- **Request Name**: Update existing settings
  ### 📤 Request Body (JSON)
```json
{ "businessHours": { "mon": "10-19", "tue": "10-19", "wed": "10-19", "thu": "10-19", "fri": "10-19", "sat": "11-15", "sun": "closed" }, "brandName": "Rothesay", "logoUrl": "https://cdn.example.com/logos/updated.png", "primaryColor": "#123456", "secondaryColor": "#654321", "timezone": "Asia/Kolkata" }
```
 ### 📤 Response Body (JSON) 
```json
{ "businessHours": { "mon": "10-19", "tue": "10-19", "wed": "10-19", "thu": "10-19", "fri": "10-19", "sat": "11-15", "sun": "closed" }, "brandName": "Rothesay", "logoUrl": "https://cdn.example.com/logos/updated.png", "primaryColor": "#123456", "secondaryColor": "#654321", "timezone": "Asia/Kolkata" }
```
- **Response Status**: 200 OK
- ----
## 🔄 Endpoint: Delete Settings

### ✅ Request Details

- **Type**: DELETE
- **URL**:  http://localhost:8080/api/admin/settings
- **Request Name**: Delete Settings

- **Response Status**: 200 OK
- - ----
