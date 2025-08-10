## A) 📍 Address Autocomplete (Sender/Receiver Forms)

### Frontend Tasks

* **A1. UI Inputs**

  * Add `pickupAddress` and `deliveryAddress` fields with Google **Places Autocomplete**.
  * Debounce user input; show loading and graceful empty-state.
* **A2. Country Restriction**

  * Restrict suggestions to **IN** (configurable via env: `NEXT_PUBLIC_PLACES_COUNTRY=IN`).
* **A3. Field Extraction & Normalization**

  * From the selected place, extract:

    * `formatted_address`, `geometry.location.lat/lng`
    * `postal_code`, `locality` or `administrative_area_level_2` (city fallback)
  * Normalize to DTO: `{ formattedAddress, lat, lng, postalCode, city }`.
* **A4. Form Binding**

  * Bind extracted values into order create/edit forms.
  * Prevent submission until geocode is present when address is provided.
* **A5. Error & Rate-limit Handling**

  * Handle Places failures (quota, network); fallback to plain text input with warning.
* **A6. Key Handling**

  * Load Maps JS with key from env; avoid exposing unneeded scopes.

#### Acceptance Criteria (Frontend)

* Selecting a suggestion populates the form and stores **lat/lng/city/postal\_code/formatted\_address**.
* Country filter limits suggestions to India (or configured list).
* Form cannot submit unless `lat` and `lng` exist for each provided address.
* Graceful fallback if Places API fails.

#### Sample Frontend Snippet (React)

```tsx
// Pseudo-code
const autocomplete = new google.maps.places.Autocomplete(inputEl, {
  fields: ["formatted_address", "geometry", "address_components"],
  componentRestrictions: { country: [process.env.NEXT_PUBLIC_PLACES_COUNTRY || "IN"] },
});
autocomplete.addListener("place_changed", () => {
  const p = autocomplete.getPlace();
  const {lat, lng} = p.geometry.location;
  const get = (type:string) => p.address_components?.find(c=>c.types.includes(type))?.long_name;
  setValue({
    formattedAddress: p.formatted_address,
    lat: lat(),
    lng: lng(),
    city: get("locality") || get("administrative_area_level_2"),
    postalCode: get("postal_code")
  });
});
```

### Backend Tasks

* **A7. Order DTO & Validation**

  * Extend `OrderCreateRequest` with `pickupGeo` & `deliveryGeo` objects.
  * Validate lat ∈ \[-90,90], lng ∈ \[-180,180], postal code regex.
* **A8. Persistence**

  * Save normalized fields into `orders` table columns:

    * `pickup_lat`, `pickup_lng`, `pickup_city`, `pickup_postal_code`, `pickup_formatted_address`
    * `delivery_lat`, `delivery_lng`, `delivery_city`, `delivery_postal_code`, `delivery_formatted_address`
* **A9. Multi-tenant Guard**

  * Ensure tenant isolation by `company_id` (from JWT) on create/read.

#### API Contract – Create Order (excerpt)

`POST /api/orders`

```json
{
  "senderName":"Alice",
  "receiverName":"Bob",
  "pickupGeo":{
    "formattedAddress":"221B Baker Street, London",
    "lat":51.5237,
    "lng":-0.1585,
    "postalCode":"NW1 6XE",
    "city":"London"
  },
  "deliveryGeo":{
    "formattedAddress":"456 B St, Mumbai",
    "lat":19.0760,
    "lng":72.8777,
    "postalCode":"400001",
    "city":"Mumbai"
  }
}
```

**201 Created** → returns `orderId` + echoed geodata.

---

## B) 📌 Order Tracking Map (Customer View)

### Frontend Tasks

* **B1. Map Render**

  * Add map to order-tracking page `/:orderId/track`.
  * Show courier marker, customer destination marker, and route polyline (optional).
* **B2. Data Fetch Strategy**

  * **Option 1 (Polling):** call `GET /api/track/{orderId}/latest` every 10–15s.
  * **Option 2 (Realtime):** subscribe to WebSocket topic `/topic/orders/{orderId}` or **SSE** `/api/track/{orderId}/stream`.
* **B3. UI States**

  * Loading, no-location (yet), last-updated timestamp, accuracy badge if provided.
* **B4. Battery/Network**

  * Pause polling when tab hidden; resume on focus.

#### Acceptance Criteria (Frontend)

* Map loads with last known courier point within <3s on broadband.
* Marker updates with each poll/message; the “last updated” ticks.
* Route/polyline optional, feature-flagged.

### Backend Tasks

* **B5. Query Latest Point**

  * Endpoint: `GET /api/track/{orderId}/latest`
  * Returns `{lat, lng, capturedAt, source}`.
* **B6. Historical Trail (optional)**

  * `GET /api/track/{orderId}/history?from=...&to=...&limit=500`.
* **B7. Realtime Push**

  * WebSocket topic or SSE stream emitting new points.
* **B8. Caching**

  * Cache latest point per order (e.g., Redis key `track:order:{id}:latest`).

#### API Responses

```json
// latest
{
  "orderId":"3f1e...",
  "lat":19.1123,
  "lng":72.8532,
  "capturedAt":"2025-08-10T09:35:22Z",
  "source":"courier-app"
}
```

---

## C) 🚚 Courier Live Location (Mobile App/Web)

### Frontend (Courier App) Tasks

* **C1. Permission & Capturing**

  * Request geolocation permission; background-friendly on mobile PWA/native.
* **C2. Uploader**

  * Send coordinates on interval (e.g., **every 15s while on active delivery**; exponential backoff on failure).
  * Payload includes `orderId`, `lat`, `lng`, `accuracy`, `speed` (if available), `deviceTs`.
* **C3. Auth**

  * Use courier JWT; auto-refresh; 401 → re-login.
* **C4. Power/Network Safety**

  * Skip upload if position unchanged beyond tolerance; queue offline points.

### Backend Tasks

* **C5. Ingest Endpoint**

  * `POST /api/courier/track`
  * Auth: `ROLE_COURIER` only; rate-limit per user (e.g., 10 req/min).
* **C6. Persistence**

  * Upsert current location (for latest) + append to `tracking_points`.
* **C7. Linkage**

  * Validate courier is assigned to `orderId`; else 403.
* **C8. Fan-out**

  * Publish event → WebSocket/SSE for customer view (B7).

#### Ingest Request

```json
{
  "orderId":"3f1e...",
  "lat":19.1123,
  "lng":72.8532,
  "accuracy":12.5,
  "speed":8.2,
  "deviceTs":"2025-08-10T09:35:10Z"
}
```

**202 Accepted** on success.

---

## Shared Backend: Schema & Indexing

### Tables

* **`tracking_points`**

  * `id UUID PK`, `order_id UUID FK`, `courier_user_id UUID`, `lat DECIMAL(9,6)`, `lng DECIMAL(9,6)`, `accuracy REAL NULL`, `speed REAL NULL`, `source VARCHAR(20)`, `captured_at TIMESTAMPTZ DEFAULT now()`
* **`orders`** (extended per earlier work)

  * pickup/delivery geofields described in A8.

### Indexes

* `CREATE INDEX idx_track_order_time ON tracking_points(order_id, captured_at DESC);`
* `CREATE INDEX idx_track_geo ON tracking_points USING gist (ll_to_earth(lat, lng));` *(optional earthdistance)*

---

## Security, Keys & Config

* **API Keys**

  * `GOOGLE_MAPS_JS_KEY` (referrer-restricted to domains; dev: `http://localhost:*`),
  * Enable **Maps JavaScript API** & **Places API** only.
* **Backend Auth**

  * JWT with roles: `ADMIN`, `STAFF`, `COURIER`, `CUSTOMER`.
  * Endpoints restricted accordingly.
* **Rate Limits**

  * `/api/courier/track`: 10/min per courier; `/api/track/*`: 60/min per IP.
* **CORS**

  * Allow only known frontends.

---

## Validation & Error Handling

* Return `400` when lat/lng missing or out of bounds; `403` when courier not assigned; `404` unknown order; `429` on rate limit.
* Standard error schema:

```json
{ "timestamp":"...","status":400,"error":"Bad Request","message":"lat must be between -90 and 90","path":"/api/courier/track" }
```

---

## QA Test Scenarios

1. Autocomplete returns India-only results; selecting fills all fields.
2. Order create validates and persists all geofields.
3. Courier pushes location every 15s; server stores and exposes latest.
4. Customer tracking page updates marker via polling and via realtime.
5. Unauthorized courier → 403; wrong tenant → 403.
6. Key restriction: prod key works only on prod domain; dev key blocked on prod.

---

## Definition of Done (per module)

* **A) Autocomplete**: Form fields populated & persisted; unit tests for DTO mapping; e2e test creating order with geodata.
* **B) Tracking View**: Map renders, updates via polling; SSE/WS behind feature flag; UX states done; lighthouse performance ≥90.
* **C) Courier Live**: Background-safe uploader; offline queue; backend rate-limit & assignment check; real-time fan-out working.

---

## Quick API Summary

* `POST /api/orders` – create order with `pickupGeo` & `deliveryGeo` (auth: STAFF/ADMIN)
* `POST /api/courier/track` – ingest courier location (auth: COURIER)
* `GET /api/track/{orderId}/latest` – latest point (auth: CUSTOMER with token or signed link)
* `GET /api/track/{orderId}/history` – historical points (auth: CUSTOMER/STAFF)
* `GET /api/track/{orderId}/stream` – SSE realtime (auth: CUSTOMER)

---
