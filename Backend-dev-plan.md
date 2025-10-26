
# Backend Development Plan - YourDrobe

## 1️⃣ Executive Summary

**What will be built:**
- FastAPI backend for YourDrobe wardrobe management application
- MongoDB Atlas database for clothing items and outfits
- RESTful API supporting clothing catalog, outfit builder, analytics, and image management
- **No authentication system** - open access for all users

**Why:**
- Replace localStorage with persistent cloud storage
- Enable multi-device access to wardrobe data
- Support future features like sharing and AI recommendations
- Simplified single-user experience without login barriers

**Constraints:**
- Python 3.13 with FastAPI (async)
- MongoDB Atlas (Motor + Pydantic v2)
- No Docker
- Manual testing after every task via frontend UI
- Single branch Git workflow (`main`)
- Per-task testing before sprint completion
- **No authentication required** - all endpoints are public

**Sprint Structure:**
- S0: Environment Setup & Frontend Connection
- S1: Clothing Items CRUD
- S2: Outfit Management
- S3: Analytics & Resale Data
- S4: Image Upload & Storage

---

## 2️⃣ In-Scope & Success Criteria

**In-Scope Features:**
- Clothing item CRUD (create, read, update, delete)
- Filtering by type (tops/bottoms/outerwear/shoes/accessories)
- Filtering by category (casual/sports/formal/loungewear)
- Search by name and color
- Outfit creation with multiple items
- Outfit scheduling by date
- Mark outfit as worn (updates item usage stats)
- Analytics: most/least worn items, color distribution, category breakdown
- Image upload via base64 or URL
- Usage tracking (timesWorn, lastWorn)

**Success Criteria:**
- All frontend features functional end-to-end
- All task-level manual tests pass via UI
- Each sprint's code pushed to `main` after verification
- Data persists across sessions
- Images display correctly in all views

---

## 3️⃣ API Design

**Base Path:** `/api/v1`

**Error Envelope:** `{ "error": "message" }`

**Note:** All endpoints are public - no authentication required

### Clothing Items Endpoints

**POST /api/v1/items**
- Purpose: Create clothing item
- Request: `{ "name": "string", "type": "tops|bottoms|outerwear|shoes|accessories", "color": "string", "category": "casual|sports|formal|loungewear", "imageUrl": "string" }`
- Response: `{ "id": "string", "name": "string", "type": "string", "color": "string", "category": "string", "imageUrl": "string", "timesWorn": 0, "lastWorn": null, "createdAt": "ISO8601" }`
- Validation: Required fields, valid enum values

**GET /api/v1/items**
- Purpose: List all clothing items
- Query Params: `?type=tops&category=casual&search=black`
- Response: `{ "items": [...], "total": number }`
- Filtering: type, category, search (name/color)

**GET /api/v1/items/:id**
- Purpose: Get single item details
- Response: Item object with full details

**PUT /api/v1/items/:id**
- Purpose: Update clothing item
- Request: Partial item object
- Response: Updated item object

**DELETE /api/v1/items/:id**
- Purpose: Delete clothing item
- Response: `{ "message": "Item deleted" }`
- Side Effect: Remove from all outfits

### Outfit Endpoints

**POST /api/v1/outfits**
- Purpose: Create outfit
- Request: `{ "name": "string", "itemIds": ["string"], "scheduledDate": "YYYY-MM-DD" (optional) }`
- Response: `{ "id": "string", "name": "string", "items": [...], "timesWorn": 0, "scheduledDate": "string", "createdAt": "ISO8601" }`
- Validation: At least 1 item

**GET /api/v1/outfits**
- Purpose: List all outfits
- Query Params: `?scheduledDate=2025-01-15`
- Response: `{ "outfits": [...], "total": number }`

**GET /api/v1/outfits/:id**
- Purpose: Get single outfit with populated items
- Response: Outfit object with full item details

**PUT /api/v1/outfits/:id**
- Purpose: Update outfit
- Request: Partial outfit object
- Response: Updated outfit object

**DELETE /api/v1/outfits/:id**
- Purpose: Delete outfit
- Response: `{ "message": "Outfit deleted" }`

**POST /api/v1/outfits/:id/wear**
- Purpose: Mark outfit as worn
- Request: `{ "date": "YYYY-MM-DD" (optional, defaults to today) }`
- Response: Updated outfit object
- Side Effect: Increment timesWorn and update lastWorn for all items

### Analytics Endpoints

**GET /api/v1/analytics/summary**
- Purpose: Get wardrobe analytics
- Response: `{ "totalItems": number, "totalWears": number, "avgWears": number, "mostWorn": [...], "leastWorn": [...], "colorDistribution": {...}, "categoryDistribution": {...} }`

### Image Upload Endpoint

**POST /api/v1/upload**
- Purpose: Upload image (base64 or URL)
- Request: `{ "image": "base64string" }` or `{ "imageUrl": "string" }`
- Response: `{ "imageUrl": "string" }`
- Validation: Max 5MB, image formats only

---

## 4️⃣ Data Model (MongoDB Atlas)

### Collection: `clothing_items`
- `_id`: ObjectId (auto)
- `name`: string (required)
- `type`: string (required, enum: tops/bottoms/outerwear/shoes/accessories)
- `color`: string (required)
- `category`: string (required, enum: casual/sports/formal/loungewear)
- `image_url`: string (required)
- `times_worn`: int (default: 0)
- `last_worn`: date (optional)
- `created_at`: datetime (default: now)
- `updated_at`: datetime (default: now)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Black T-Shirt",
  "type": "tops",
  "color": "black",
  "category": "casual",
  "image_url": "https://storage.example.com/abc123.jpg",
  "times_worn": 5,
  "last_worn": "2025-01-20",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-20T10:00:00Z"
}
```

### Collection: `outfits`
- `_id`: ObjectId (auto)
- `name`: string (required)
- `item_ids`: array of ObjectId (required, ref: clothing_items)
- `scheduled_date`: date (optional, indexed)
- `times_worn`: int (default: 0)
- `last_worn`: date (optional)
- `created_at`: datetime (default: now)
- `updated_at`: datetime (default: now)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Casual Friday",
  "item_ids": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439014"],
  "scheduled_date": "2025-01-25",
  "times_worn": 2,
  "last_worn": "2025-01-20",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-20T10:00:00Z"
}
```

---

## 5️⃣ Configuration & ENV Vars

**Required Environment Variables:**
- `APP_ENV` - Environment (development, production)
- `PORT` - HTTP port (default: 8000)
- `MONGODB_URI` - MongoDB Atlas connection string
- `CORS_ORIGINS` - Allowed frontend URL(s) (comma-separated)

**Example `.env`:**
```
APP_ENV=development
PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yourdrobe?retryWrites=true&w=majority
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 6️⃣ Background Work

**Not Required for MVP**
- All operations are synchronous
- No background tasks needed
- Image processing happens inline during upload

---

## 7️⃣ Integrations

**Image Storage (Optional Enhancement):**
- MVP: Store base64 images directly in MongoDB
- Future: Integrate with Cloudinary or AWS S3
- No additional env vars needed for MVP

---

## 8️⃣ Testing Strategy (Manual via Frontend)

**Testing Approach:**
- Every task includes Manual Test Step and User Test Prompt
- Test via frontend UI after each backend change
- Verify API responses in browser DevTools Network tab
- Check MongoDB Atlas data browser for persistence
- After all tasks in sprint pass → commit and push to `main`
- If any test fails → fix and retest before proceeding

**Test Verification:**
- Frontend displays correct data
- Network tab shows 200 OK responses
- MongoDB contains expected documents
- No console errors
- Data persists across page refreshes

---

## 🔟 Dynamic Sprint Plan & Backlog

---

## S0 – Environment Setup & Frontend Connection

**Objectives:**
- Create FastAPI skeleton with `/api/v1` base path
- Connect to MongoDB Atlas using Motor
- Implement `/healthz` endpoint with DB ping
- Enable CORS for frontend
- Replace frontend dummy API URLs with real backend
- Initialize Git repo with single `main` branch
- Create root `.gitignore` file

**User Stories:**
- As a developer, I need a working FastAPI server so I can build endpoints
- As a developer, I need MongoDB connection so I can persist data
- As a developer, I need CORS enabled so frontend can call backend
- As a user, I need the app to connect to real backend so data persists

**Tasks:**

### Task 1: Create FastAPI Project Structure
- Create `backend/` directory at project root
- Create `backend/main.py` with FastAPI app
- Create `backend/requirements.txt` with dependencies:
  - fastapi
  - uvicorn[standard]
  - motor
  - pydantic>=2.0
  - pydantic-settings
  - python-multipart
- Create `backend/.env.example` with all required vars
- Create `backend/config.py` for settings management using Pydantic BaseSettings

**Manual Test Step:** Run `uvicorn backend.main:app --reload` → server starts on port 8000

**User Test Prompt:** "Start the backend with `uvicorn backend.main:app --reload` and verify it runs without errors on http://localhost:8000"

### Task 2: Implement Health Check Endpoint
- Create `/healthz` endpoint in `main.py`
- Implement MongoDB ping check
- Return JSON: `{ "status": "healthy", "database": "connected" }`
- Handle DB connection errors gracefully

**Manual Test Step:** Open http://localhost:8000/healthz → see `{ "status": "healthy", "database": "connected" }`

**User Test Prompt:** "Navigate to http://localhost:8000/healthz and confirm you see a healthy status with database connected"

### Task 3: Configure MongoDB Atlas Connection
- Create `backend/database.py` with Motor async client
- Implement connection function using `MONGODB_URI` from env
- Add connection lifecycle (startup/shutdown events)
- Test connection in `/healthz` endpoint

**Manual Test Step:** Check MongoDB Atlas dashboard → see connection from your IP

**User Test Prompt:** "Check your MongoDB Atlas dashboard and verify there's an active connection from your application"

### Task 4: Enable CORS for Frontend
- Add CORS middleware to FastAPI app
- Configure allowed origins from `CORS_ORIGINS` env var
- Allow credentials, all methods, all headers
- Test preflight requests

**Manual Test Step:** Open browser DevTools → Network tab → see CORS headers in responses

**User Test Prompt:** "Open browser DevTools, go to Network tab, and verify CORS headers are present in API responses"

### Task 5: Update Frontend API Configuration
- Update `frontend/src/config/api.ts` to remove auth endpoints
- Remove `getAuthHeaders()` and `fetchWithAuth()` functions
- Update all frontend API calls to use standard fetch
- Remove localStorage token management
- Remove auth-related imports from components

**Manual Test Step:** Frontend loads → Network tab shows requests to localhost:8000

**User Test Prompt:** "Start the frontend and check Network tab - you should see API requests going to http://localhost:8000/api/v1"

### Task 6: Initialize Git Repository
- Run `git init` at project root (if not already initialized)
- Create `.gitignore` at root with:
  - `__pycache__/`
  - `*.pyc`
  - `*.pyo`
  - `.env`
  - `.venv/`
  - `venv/`
  - `.DS_Store`
  - `node_modules/`
- Set default branch to `main`: `git branch -M main`
- Create initial commit
- Create GitHub repo and push

**Manual Test Step:** Run `git status` → see clean working tree with ignored files not tracked

**User Test Prompt:** "Run `git status` and verify that .env and __pycache__ files are not tracked"

**Definition of Done:**
- Backend runs locally on port 8000
- `/healthz` returns success with DB connection status
- MongoDB Atlas shows active connection
- CORS headers present in responses
- Frontend makes requests to backend (even if they fail due to missing endpoints)
- Git repo initialized with `main` branch
- `.gitignore` properly excludes sensitive files
- Initial commit pushed to GitHub
- All auth-related code removed from frontend

**Post-Sprint:** Commit all changes and push to `main`

---

## S1 – Clothing Items CRUD

**Objectives:**
- Implement full CRUD for clothing items
- Support filtering by type and category
- Support search by name and color
- Update frontend to use real API

**User Stories:**
- As a user, I can add clothing items so I can build my digital wardrobe
- As a user, I can view all my items so I can see what I own
- As a user, I can filter items so I can find specific pieces
- As a user, I can update items so I can correct mistakes
- As a user, I can delete items so I can remove donated/sold pieces

**Tasks:**

### Task 1: Create Clothing Item Model
- Create `backend/models/clothing_item.py` with Pydantic model
- Fields: name, type, color, category, image_url, times_worn, last_worn, created_at, updated_at
- Create `backend/schemas/clothing_item.py` with request/response schemas
- Validate type enum (tops/bottoms/outerwear/shoes/accessories)
- Validate category enum (casual/sports/formal/loungewear)

**Manual Test Step:** Import model in Python shell → no errors

**User Test Prompt:** "Run `python -c 'from backend.models.clothing_item import ClothingItem'` and verify no import errors"

### Task 2: Create POST /api/v1/items Endpoint
- Create `backend/routers/items.py`
- Implement create item endpoint
- Validate all required fields
- Initialize times_worn to 0
- Store in MongoDB
- Return created item with id

**Manual Test Step:** Use Postman → POST item → see item in MongoDB

**User Test Prompt:** "Use Postman to POST a new clothing item and verify it appears in MongoDB Atlas"

### Task 3: Create GET /api/v1/items Endpoint
- Implement list items endpoint
- Support query params: type, category, search
- Search matches name or color (case-insensitive)
- Return array of items with total count

**Manual Test Step:** Use Postman → GET items → see all items

**User Test Prompt:** "Use Postman to GET /api/v1/items and verify you see all items"

### Task 4: Create GET /api/v1/items/:id Endpoint
- Implement get single item endpoint
- Return 404 if not found
- Return full item details

**Manual Test Step:** Use Postman → GET specific item → see details

**User Test Prompt:** "Use Postman to GET a specific item by ID and verify you see all its details"

### Task 5: Create PUT /api/v1/items/:id Endpoint
- Implement update item endpoint
- Allow partial updates
- Update updated_at timestamp
- Return updated item

**Manual Test Step:** Use Postman → PUT update item name → see change in MongoDB

**User Test Prompt:** "Use Postman to update an item's name and verify the change is reflected in the database"

### Task 6: Create DELETE /api/v1/items/:id Endpoint
- Implement delete item endpoint
- Delete from MongoDB
- Return success message
- Note: Outfit cleanup will be handled in S2

**Manual Test Step:** Use Postman → DELETE item → verify removed from MongoDB

**User Test Prompt:** "Use Postman to DELETE an item and verify it's removed from MongoDB Atlas"

### Task 7: Integrate Items API with Frontend Upload View
- Update `frontend/src/components/UploadView.tsx`
- Replace localStorage with API call to POST /api/v1/items
- Handle image upload (base64 for now)
- Show loading state during upload
- Handle errors with toast notifications

**Manual Test Step:** Frontend upload form → add item → see in wardrobe view

**User Test Prompt:** "Use the upload form to add a new clothing item and verify it appears in your wardrobe"

### Task 8: Integrate Items API with Frontend Wardrobe View
- Update `frontend/src/components/WardrobeView.tsx`
- Fetch items from GET /api/v1/items on mount
- Implement filtering with query params
- Implement search with debouncing
- Show loading skeleton while fetching

**Manual Test Step:** Frontend wardrobe view → see all items → apply filter → see filtered items

**User Test Prompt:** "Open the wardrobe view and use the filters to filter by type or category - verify the results update correctly"

### Task 9: Implement Item Update in Frontend
- Add edit functionality to item detail dialog
- Call PUT /api/v1/items/:id on save
- Update local state after successful update
- Handle errors

**Manual Test Step:** Click item → edit name → save → see updated name

**User Test Prompt:** "Click on an item, edit its name, save, and verify the change is reflected immediately"

### Task 10: Implement Item Delete in Frontend
- Update delete handler to call DELETE /api/v1/items/:id
- Show confirmation dialog
- Remove from local state after successful delete
- Handle errors

**Manual Test Step:** Click item → delete → confirm → item removed from view

**User Test Prompt:** "Delete an item from your wardrobe and verify it's removed from the view and database"

**Definition of Done:**
- Users can create items via frontend upload form
- Users can view all items in wardrobe view
- Users can filter by type and category
- Users can search by name and color
- Users can update item details
- Users can delete items
- All operations persist to MongoDB

**Post-Sprint:** Commit all changes and push to `main`

---

## S2 – Outfit Management

**Objectives:**
- Implement outfit CRUD operations
- Support outfit scheduling by date
- Implement "mark as worn" functionality
- Update item usage statistics when outfit worn
- Integrate with frontend outfit builder and calendar

**User Stories:**
- As a user, I can create outfits so I can plan my looks
- As a user, I can schedule outfits so I can plan ahead
- As a user, I can mark outfits as worn so I can track usage
- As a user, I can view outfits by date so I can see my schedule
- As a user, I can delete outfits so I can remove old plans

**Tasks:**

### Task 1: Create Outfit Model
- Create `backend/models/outfit.py` with Pydantic model
- Fields: name, item_ids (array), scheduled_date, times_worn, last_worn, created_at, updated_at
- Create `backend/schemas/outfit.py` with request/response schemas
- OutfitCreate: name, item_ids, scheduled_date (optional)
- OutfitResponse: includes populated items array

**Manual Test Step:** Import model in Python shell → no errors

**User Test Prompt:** "Run `python -c 'from backend.models.outfit import Outfit'` and verify no import errors"

### Task 2: Create POST /api/v1/outfits Endpoint
- Create `backend/routers/outfits.py`
- Implement create outfit endpoint
- Validate item_ids exist
- Initialize times_worn to 0
- Store in MongoDB
- Return created outfit

**Manual Test Step:** Use Postman → POST outfit with item IDs → see outfit in MongoDB

**User Test Prompt:** "Use Postman to create an outfit with valid item IDs and verify it's stored in MongoDB"

### Task 3: Create GET /api/v1/outfits Endpoint
- Implement list outfits endpoint
- Support query param: scheduledDate (YYYY-MM-DD)
- Populate item details from clothing_items collection
- Return array of outfits with populated items

**Manual Test Step:** Use Postman → GET outfits → see outfits with full item details

**User Test Prompt:** "Use Postman to GET /api/v1/outfits and verify you see your outfits with complete item information"

### Task 4: Create GET /api/v1/outfits/:id Endpoint
- Implement get single outfit endpoint
- Populate all item details
- Return 404 if not found

**Manual Test Step:** Use Postman → GET specific outfit → see full details with items

**User Test Prompt:** "Use Postman to GET a specific outfit by ID and verify all item details are included"

### Task 5: Create PUT /api/v1/outfits/:id Endpoint
- Implement update outfit endpoint
- Allow updating name, item_ids, scheduled_date
- Validate new item_ids if provided
- Update updated_at timestamp
- Return updated outfit with populated items

**Manual Test Step:** Use Postman → PUT update outfit name → see change in MongoDB

**User Test Prompt:** "Use Postman to update an outfit's name and verify the change persists"

### Task 6: Create DELETE /api/v1/outfits/:id Endpoint
- Implement delete outfit endpoint
- Delete from MongoDB
- Return success message
- Note: Does not affect clothing items

**Manual Test Step:** Use Postman → DELETE outfit → verify removed from MongoDB

**User Test Prompt:** "Use Postman to DELETE an outfit and verify it's removed but the clothing items remain"

### Task 7: Create POST /api/v1/outfits/:id/wear Endpoint
- Implement mark as worn endpoint
- Accept optional date (defaults to today)
- Increment outfit times_worn
- Update outfit last_worn
- For each item in outfit:
  - Increment item times_worn
  - Update item last_worn
- Return updated outfit

**Manual Test Step:** Use Postman → POST wear outfit → check item times_worn increased in MongoDB

**User Test Prompt:** "Use Postman to mark an outfit as worn and verify the times_worn counter increases for both the outfit and all its items"

### Task 8: Integrate Outfits API with Frontend Outfit Builder
- Update `frontend/src/components/OutfitBuilder.tsx`
- Replace localStorage with API calls
- POST to create outfit with selected items and scheduled date
- Fetch outfits on mount
- Handle loading and error states

**Manual Test Step:** Frontend outfit builder → create outfit → see in calendar view

**User Test Prompt:** "Use the outfit builder to create a new outfit and verify it appears in the calendar view"

### Task 9: Integrate Mark as Worn with Frontend
- Update outfit detail dialog
- Call POST /api/v1/outfits/:id/wear when "Wore Today" clicked
- Refresh outfit and items data after marking worn
- Show success toast

**Manual Test Step:** View outfit → click "Wore Today" → see times_worn increment

**User Test Prompt:** "Open an outfit and click 'Wore Today' - verify the wear count increases for the outfit and all its items"

### Task 10: Integrate Calendar View with Outfits API
- Update `frontend/src/components/CalendarView.tsx`
- Fetch outfits with scheduled dates
- Display outfits on calendar by date
- Handle date selection and outfit viewing

**Manual Test Step:** Calendar view → see scheduled outfits on dates → click date → see outfit list

**User Test Prompt:** "Open the calendar view and verify you see your scheduled outfits on the correct dates"

**Definition of Done:**
- Users can create outfits via frontend
- Users can schedule outfits for specific dates
- Users can view outfits in calendar
- Users can mark outfits as worn
- Marking outfit as worn updates all item statistics
- Users can update and delete outfits
- All operations persist to MongoDB

**Post-Sprint:** Commit all changes and push to `main`

---

## S3 – Analytics & Resale Data

**Objectives:**
- Implement analytics summary endpoint
- Calculate most/least worn items
- Calculate color and category distributions
- Provide resale opportunity data
- Integrate with frontend analytics view

**User Stories:**
- As a user, I can see my most worn items so I know my favorites
- As a user, I can see underutilized items so I can consider selling them
- As a user, I can see color distribution so I understand my wardrobe palette
- As a user, I can see category breakdown so I know my wardrobe composition

**Tasks:**

### Task 1: Create Analytics Service
- Create `backend/services/analytics.py`
- Implement `calculate_wardrobe_stats() -> dict`
- Calculate total items, total wears, average wears
- Identify most worn items (top 5)
- Identify least worn items (worn ≤2 times or not worn in 60+ days)
- Calculate color distribution
- Calculate category distribution

**Manual Test Step:** Python shell → call analytics function → see calculated stats

**User Test Prompt:** "Test analytics calculation in Python shell and verify it returns correct statistics"

### Task 2: Create GET /api/v1/analytics/summary Endpoint
- Create `backend/routers/analytics.py`
- Implement analytics summary endpoint
- Call analytics service
- Return comprehensive analytics object
- Include item details for most/least worn

**Manual Test Step:** Use Postman → GET analytics → see summary with all stats

**User Test Prompt:** "Use Postman to GET /api/v1/analytics/summary and verify you see complete analytics data"

### Task 3: Integrate Analytics API with Frontend
- Update `frontend/src/components/AnalyticsView.tsx`
- Replace local calculations with API call
- Fetch analytics on mount
- Display all analytics sections
- Handle loading state

**Manual Test Step:** Frontend analytics view → see most worn, least worn, colors, categories

**User Test Prompt:** "Open the analytics view and verify you see your most worn items, least worn items, color distribution, and category breakdown"

### Task 4: Add Resale Value Estimation
- Add estimated value calculation to analytics service
- Base values by category (formal: $40, casual: $20, sports: $25, loungewear: $15)
- Include in least worn items response
- Display in frontend resale section

**Manual Test Step:** Analytics view → resale section → see estimated values

**User Test Prompt:** "Check the resale opportunities section and verify each item shows an estimated value"

### Task 5: Test Analytics Updates in Real-Time
- Add items → verify analytics update
- Mark outfit as worn → verify analytics update
- Delete items → verify analytics update
- Ensure all calculations reflect current data

**Manual Test Step:** Add item → refresh analytics → see updated counts

**User Test Prompt:** "Add a new item, then refresh the analytics view and verify the total items count increases"

**Definition of Done:**
- Analytics endpoint returns accurate statistics
- Most worn items displayed correctly
- Least worn items identified for resale
- Color distribution shows wardrobe palette
- Category breakdown shows composition
- Analytics update when wardrobe changes
- Frontend displays all analytics sections
- Resale values estimated and displayed

**Post-Sprint:** Commit all changes and push to `main`

---

## S4 – Image Upload & Storage

**Objectives:**
- Implement image upload endpoint
- Support base64 image upload
- Support image URL input
- Validate image size and format
- Store images (MongoDB for MVP)
- Integrate with frontend upload view

**User Stories:**
- As a user, I can upload photos from my device so I can catalog items visually
- As a user, I can paste image URLs so I can quickly add items
- As a user, I can see my uploaded images so I can identify items
- As a developer, I can validate images so storage is not abused

**Tasks:**

### Task 1: Create Image Upload Endpoint
- Create `backend/routers/upload.py`
- Implement POST /api/v1/upload endpoint
- Accept base64 image or image URL
- Validate image format (JPG, PNG, HEIC)
- Validate size (max 5MB)
- Return image URL or base64 string

**Manual Test Step:** Use Postman → POST base64 image → receive image URL

**User Test Prompt:** "Use Postman to upload a base64-encoded image and verify you receive a valid image URL"

### Task 2: Implement Base64 Image Validation
- Create `backend/utils/image.py`
- Implement `validate_base64_image(data: str) -> bool`
- Check image format from data URI
- Check decoded size
- Return validation result

**Manual Test Step:** Python shell → validate valid/invalid images → see correct results

**User Test Prompt:** "Test image validation in Python shell with valid and invalid base64 strings"

### Task 3: Implement Image URL Validation
- Add `validate_image_url(url: str) -> bool` to image utils
- Check URL format
- Optionally verify URL is accessible
- Check content-type header

**Manual Test Step:** Python shell → validate valid/invalid URLs → see correct results

**User Test Prompt:** "Test URL validation with valid and invalid image URLs"

### Task 4: Store Images in MongoDB (MVP Approach)
- Store base64 images directly in clothing_items collection
- For URLs, store the URL string
- Add image_type field (base64 or url)
- Update item model to support both types

**Manual Test Step:** Create item with base64 image → see stored in MongoDB

**User Test Prompt:** "Create an item with an uploaded image and verify the image data is stored in MongoDB"

### Task 5: Integrate Upload with Frontend Camera/File Input
- Update `frontend/src/components/UploadView.tsx`
- Convert file input to base64
- Call POST /api/v1/upload before creating item
- Use returned URL in item creation
- Show upload progress

**Manual Test Step:** Frontend upload → select photo → see preview → add item → see in wardrobe

**User Test Prompt:** "Use the upload form to take a photo or select from gallery, and verify it appears in your wardrobe"

### Task 6: Integrate Upload with Frontend URL Input
- Handle URL input method
- Call POST /api/v1/upload with URL
- Validate URL before submission
- Show preview of URL image

**Manual Test Step:** Frontend upload → paste URL → see preview → add item → see in wardrobe

**User Test Prompt:** "Paste an image URL in the upload form and verify the image appears in your wardrobe"

### Task 7: Add Image Error Handling
- Handle upload failures gracefully
- Show clear error messages for:
  - File too large
  - Invalid format
  - Network errors
- Allow retry without losing form data

**Manual Test Step:** Try uploading 10MB file → see error message → form data preserved

**User Test Prompt:** "Try uploading an oversized image and verify you see a clear error message"

### Task 8: Optimize Image Display
- Ensure images load efficiently in grid views
- Add loading skeletons for images
- Handle broken image URLs
- Show placeholder for missing images

**Manual Test Step:** Wardrobe view → images load smoothly → no layout shift

**User Test Prompt:** "Open the wardrobe view and verify images load smoothly without causing layout shifts"

### Task 9: Test Image Persistence
- Upload image → create item → refresh page → see image
- Verify images persist across sessions
- Test with multiple image types

**Manual Test Step:** Add item with image → refresh page → see same image

**User Test Prompt:** "Add an item with an image, refresh the page, and verify the image is still there"

### Task 10: Document Image Storage Strategy
- Add comments explaining MVP approach (base64 in MongoDB)
- Document future enhancement path (Cloudinary/S3)
- Note performance considerations
- Add TODO for production optimization

**Manual Test Step:** Read code comments → understand storage approach

**User Test Prompt:** "Review the image upload code and verify it includes clear documentation"

**Definition of Done:**
- Users can upload images from device camera/gallery
- Users can input image URLs
- Images validated for size and format
- Images stored in MongoDB (base64 or URL)
- Images display correctly in all views
- Upload errors handled gracefully
- Images persist across sessions
- Frontend shows upload progress
- Code documented for future enhancements

**Post-Sprint:** Commit all changes and push to `main`

---

## ✅ FINAL VERIFICATION CHECKLIST

After completing all sprints, verify:

**Clothing Items:**
- [ ] Users can add items with photos
- [ ] Users can view all their items
- [ ] Users can filter by type and category
- [ ] Users can search by name and color
- [ ] Users can update item details
- [ ] Users can delete items
- [ ] Items persist in MongoDB

**Outfits:**
- [ ] Users can create outfits with multiple items
- [ ] Users can schedule outfits for specific dates
- [ ] Users can view outfits in calendar
- [ ] Users can mark outfits as worn
- [ ] Marking worn updates item statistics
- [ ] Users can delete outfits
- [ ] Outfits persist in MongoDB

**Analytics:**
- [ ] Most worn items displayed correctly
- [ ] Least worn items shown for resale
- [ ] Color distribution accurate
- [ ] Category breakdown correct
- [ ] Analytics update when data changes
- [ ] Resale values estimated

**Images:**
- [ ] Camera/file upload works
- [ ] URL input works
- [ ] Images display in all views
- [ ] Images persist across sessions
- [ ] Upload errors handled gracefully

**General:**
- [ ] All API endpoints return proper status codes
- [ ] Error messages are clear and helpful
- [ ] CORS configured correctly
- [ ] MongoDB connection stable
- [ ] No console errors in frontend
- [ ] All code pushed to `main` branch
- [ ] `.env` file not committed
- [ ] README updated with setup instructions

---

## 📚 APPENDIX: SETUP INSTRUCTIONS

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3.13 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB Atlas URI and other settings
# Get MongoDB URI from: https://cloud.mongodb.com

# Run backend
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Update API base URL in src/config/api.ts
# Set to http://localhost:8000/api/v1

# Run frontend
npm run dev
```

### MongoDB Atlas Setup
1. Create account at https://cloud.mongodb.com
2. Create new cluster (free tier)
3. Create database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string
6. Add to backend/.env as MONGODB_URI

### Testing the Application
1. Start backend: `uvicorn backend.main:app --reload`
2. Start frontend: `npm run dev` (in frontend directory)
3. Open browser to http://localhost:5173
4. Add clothing items
5. Create outfits
6. View analytics

---

## 🎯 SUCCESS METRICS

**Technical Metrics:**
- All API endpoints return < 500ms response time
- 100% of frontend features functional
- Zero data loss across sessions
- All manual tests pass

**User Experience Metrics:**
- Users can add item in < 1 minute
- Users can create outfit in < 2 minutes
- Images load in < 2 seconds
- No confusing error messages

**Code Quality Metrics:**
- All endpoints have proper error handling
- All database operations use async/await
- All user data accessible without barriers
- All code follows Python PEP 8 style guide

---

**END OF BACKEND DEVELOPMENT PLAN**