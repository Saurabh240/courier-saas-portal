 Tenant Settings API Documentation (Admin Portal)

 🎯 Purpose
Allow authenticated admin users to configure tenant-specific settings such as:
- Branding (logo, brand name, colors)
- Business hours
- Timezone

1. Create Tenant Settings**
URL:
POST /api/admin/settings

Request Body:

json
{
  "businessHours": {
    "mon": "10-19",
    "tue": "10-19",
    "wed": "10-19",
    "thu": "10-19",
    "fri": "10-19",
    "sat": "11-15",
    "sun": "closed"
  },
  "brandName": "Sai logistics",
  "logoUrl": "https://cdn.example.com/logos/updated.png",
  "primaryColor": "#123456",
  "secondaryColor": "#654321",
  "timezone": "Asia/Kolkata"
}

Response (200 OK):

{
  "businessHours": {
    "mon": "10-19",
    "tue": "10-19",
    "wed": "10-19",
    "thu": "10-19",
    "fri": "10-19",
    "sat": "11-15",
    "sun": "closed"
  },
  "brandName": "Sai logistics",
  "logoUrl": "https://cdn.example.com/logos/updated.png",
  "primaryColor": "#123456",
  "secondaryColor": "#654321",
  "timezone": "Asia/Kolkata"
}

2. Get Tenant Settings
URL:
GET /api/admin/settings

Response (200 OK):

json

{
  "businessHours": {
    "mon": "10-19",
    "tue": "10-19",
    "wed": "10-19",
    "thu": "10-19",
    "fri": "10-19",
    "sat": "11-15",
    "sun": "closed"
  },
  "brandName": "Sai logistics",
  "logoUrl": "https://cdn.example.com/logos/updated.png",
  "primaryColor": "#123456",
  "secondaryColor": "#654321",
  "timezone": "Asia/Kolkata"
}

3. Update Tenant Settings
URL:
PUT /api/admin/settings

Request Body:

{
  "businessHours": {
    "mon": "10-19",
    "tue": "10-19",
    "wed": "10-19",
    "thu": "10-19",
    "fri": "10-19",
    "sat": "11-15",
    "sun": "closed"
  },
  "brandName": "Rohit",
  "logoUrl": "https://cdn.example.com/logos/updated.png",
  "primaryColor": "#123456",
  "secondaryColor": "#654321",
  "timezone": "Asia/Kolkata"
}

Response (200 OK):

json

{
  "businessHours": {
    "mon": "10-19",
    "tue": "10-19",
    "wed": "10-19",
    "thu": "10-19",
    "fri": "10-19",
    "sat": "11-15",
    "sun": "closed"
  },
  "brandName": "Rohit",
  "logoUrl": "https://cdn.example.com/logos/updated.png",
  "primaryColor": "#123456",
  "secondaryColor": "#654321",
  "timezone": "Asia/Kolkata"
}

4. Delete Tenant Settings

URL:
DELETE /api/admin/settings

Response (200 OK):

Notes
All requests require authentication.

Timezone must follow IANA timezone database.

Business hours format: "HH-HH" or "closed".