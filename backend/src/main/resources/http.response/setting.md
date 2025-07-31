# **Tenant Settings API Documentation (Admin Portal)**

🎯 Purpose: Allow authenticated admin users to configure tenant-specific settings (branding, business hours, timezone) for their portal.



## **Endpoints Summary**

### Method	  Endpoint	          Description

GET	     /api/admin/settings	   Fetch current tenant settings
POST	 /api/admin/settings	   Create new settings (if not exist)
PUT	     /api/admin/settings	       Update existing settings
DELETE	 /api/admin/settings	   Delete settings (optional)

# URL:

POST /api/admin/settings

BODY:
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


Status: 200 OK
Body:
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

# URL:

GET /api/admin/settings

Status: 200 OK
Body:
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

# URL:

PUT /api/admin/settings


BODY:
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
"brandName": "Rothesay",
"logoUrl": "https://cdn.example.com/logos/updated.png",
"primaryColor": "#123456",
"secondaryColor": "#654321",
"timezone": "Asia/Kolkata"
}


Status: 200 OK
Body:
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
"brandName": "Rothesay",
"logoUrl": "https://cdn.example.com/logos/updated.png",
"primaryColor": "#123456",
"secondaryColor": "#654321",
"timezone": "Asia/Kolkata"
}


# URL:

DELETE /api/admin/settings


Status: 200 OK