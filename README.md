# Rewa Connect – Smart City Rewa 2030

Rewa Connect is a production-quality, full-stack MERN application serving as a single unified digital hub for the citizens of Rewa. Citizens can report civic issues, track complaints transparently, receive official city announcements, search welfare schemes, and pay utility bills.

---

## Key Features

1. **Smart Complaint Management**:
   - Citizens upload photos of issues, write a description, and select a location on a Leaflet map (or click Live GPS).
   - **Backend Intelligence**: The system automatically classifies the category, maps the coordinates to the nearest of 10 Rewa localities and ward numbers, and determines the responsible department (e.g. Roads & Potholes → PWD).
   - **Timeline**: Tracks status transitions (Pending → Assigned → Accepted → In Progress → Resolved) with un-editable logs, officer details, and resolution photos.
   - **Anonymous Reports**: Citizens can toggle anonymous submission. The report remains public, but the reporter's identity is protected. Anonymous complaints are trackable by their unique Complaint ID (e.g. `RW-2026-000145`).

2. **Official Announcements**:
   - Pinned and categorized municipal notice boards for emergency alerts, road closures, and utility outages.

3. **Government Schemes Directory**:
   - Searchable and categorized welfares for students, farmers, women, and employment schemes.

4. **Municipal Utility Bills**:
   - Direct search and mock UPI checkout for Water Bills, Property Tax, and Sanitation Fees.

5. **Officer Portal**:
   - Role-restricted portal for department officers to inspect cases, transition timelines, upload work-completion photos, and add remarks.

---

## Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS v3, React Router DOM, Axios, TanStack React Query, Lucide Icons, Leaflet Maps
* **Backend**: Node.js, Express.js, JWT, Bcryptjs, Multer
* **Database**: MongoDB & Mongoose

---

## Project Structure

```
smartCityRewa/
  backend/
    config/           # DB connections
    controllers/      # API Controllers
    models/           # Mongoose schemas
    routes/           # Express Route definitions
    middleware/       # Auth (JWT) & Multer upload middleware
    services/         # Auto-detection NLP keywords & GPS locality mapping
    utils/            # Sequential ID generators
    seed/             # Seeding scripts
    uploads/          # Local files disk storage fallback
    server.js
  frontend/
    src/
      components/     # Layout, Leaflet Map Picker & Viewers
      context/        # Global Authentication Context
      pages/          # Citizens Home, Feed, Submissions, Bills & Officer Portal
      services/       # Axios API client configurations
      App.jsx
      index.css
      main.jsx
    index.html
    tailwind.config.js
```

---

## Getting Started

### 1. Configure Environment Variables
Create a `.env` file in the `backend/` folder (a template is preconfigured):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/rewa-connect
JWT_SECRET=super_secret_rewa_connect_token_key_2026_xyz

# Cloudinary configuration (optional, falls back to local uploads if empty)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 2. Install Dependencies
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### 3. Seed the Database
Ensure MongoDB is running (either locally on port 27017 or using a remote Atlas cluster specified in `MONGODB_URI`):
```bash
cd backend
npm run seed
```
*Note: This generates 15 citizens, 5 officers, 30 announcements, 20 schemes, 15 bills, and 50 complaints showing different timeline paths with realistic GPS locations and Unsplash photos.*

### 4. Run Development Servers
```bash
# Start backend API (runs on port 5000)
cd backend
npm run dev

# Start frontend Vite server (runs on port 5173)
cd ../frontend
npm run dev
```

---

## Seed Credentials for Verification
The database seeder generates accounts with default password `password123`:

- **Citizen Login**: `rajeshpatel@gmail.com` or `9876543210`
- **Officer Login (PWD)**: `alok.pwd@rewa.gov.in` or `8877665511`
- **Officer Login (Sanitation)**: `rp.sanitation@rewa.gov.in` or `8877665533`
