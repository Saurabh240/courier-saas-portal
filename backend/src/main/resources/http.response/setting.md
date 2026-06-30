# 📦 Tenant Settings API – Test Results

**Base URL**: `http://localhost:8080/api/admin/settings`
**Required Headers (all requests)**: `Authorization: Bearer <jwt>`, `X-Tenant-ID: tenant1`, `Content-Type: application/json`

---

## 🔄 Endpoint: Create tenant (prerequisite)

### ✅ Request Details

- **Type**: POST
- **URL**: http://localhost:8080/api/admin/settings/tenants?tenantId=tenant1
- **Request Name**: Create tenant1

### 📤 Response Body

```
Tenant 'tenant1' created successfully.
```

- **Response Status**: 200 OK

---

## 🔄 Endpoint: Fetch settings (first access, auto-creates defaults)

### ✅ Request Details

- **Type**: GET
- **URL**: http://localhost:8080/api/admin/settings
- **Request Name**: Fetch settings - first access

### 📤 Response Body (JSON)

```json
{
  "businessHours": {
    "MON": { "open": "09:00", "close": "18:00" },
    "TUE": { "open": "09:00", "close": "18:00" },
    "WED": { "open": "09:00", "close": "18:00" },
    "THU": { "open": "09:00", "close": "18:00" },
    "FRI": { "open": "09:00", "close": "18:00" }
  },
  "brandName": "Default Courier",
  "logoUrl": "https://cdn.yourapp.com/images/default-logo.png",
  "primaryColor": "#0000FF",
  "secondaryColor": "#FFFFFF",
  "timezone": "UTC"
}
```

- **Response Status**: 200 OK

---

## 🔄 Endpoint: Update settings (valid full update)

### ✅ Request Details

- **Type**: PUT
- **URL**: http://localhost:8080/api/admin/settings
- **Request Name**: Update settings - valid

### 📤 Request Body (JSON)

```json
{
  "businessHours": {
    "MON": { "open": "09:00", "close": "18:00" },
    "TUE": { "open": "09:00", "close": "18:00" },
    "SUN": { "open": "10:00", "close": "14:00" }
  },
  "brandName": "Sai Logistics",
  "logoUrl": "https://cdn.example.com/logos/updated.png",
  "primaryColor": "#123456",
  "secondaryColor": "#654321",
  "timezone": "Asia/Kolkata"
}
```

### 📤 Response Body (JSON)

```json
{
  "businessHours": {
    "MON": { "open": "09:00", "close": "18:00" },
    "TUE": { "open": "09:00", "close": "18:00" },
    "SUN": { "open": "10:00", "close": "14:00" }
  },
  "brandName": "Sai Logistics",
  "logoUrl": "https://cdn.example.com/logos/updated.png",
  "primaryColor": "#123456",
  "secondaryColor": "#654321",
  "timezone": "Asia/Kolkata"
}
```

- **Response Status**: 200 OK

---

## 🔄 Endpoint: Partial update settings (businessHours only)

### ✅ Request Details

- **Type**: PATCH
- **URL**: http://localhost:8080/api/admin/settings
- **Request Name**: Patch settings - businessHours only

### 📤 Request Body (JSON)

```json
{
  "businessHours": {
    "MON": { "open": "08:00", "close": "20:00" }
  }
}
```

### 📤 Response Body (JSON)

```json
{
  "businessHours": {
    "MON": { "open": "08:00", "close": "20:00" }
  },
  "brandName": "Rothesay",
  "logoUrl": "https://cdn.example.com/logos/updated.png",
  "primaryColor": "#123456",
  "secondaryColor": "#654321",
  "timezone": "Asia/Kolkata"
}
```

- **Response Status**: 200 OK

---

## 🔄 Endpoint: Delete settings

### ✅ Request Details

- **Type**: DELETE
- **URL**: http://localhost:8080/api/admin/settings
- **Request Name**: Delete settings

### 📤 Response Body

```
(empty body)
```

- **Response Status**: 204 No Content

---

