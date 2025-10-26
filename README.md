# YourDrobe - Digital Wardrobe Management

A full-stack application for managing your wardrobe, creating outfits, and tracking clothing usage.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: FastAPI (Python 3.13)
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based

## 📋 Prerequisites

- Python 3.13+
- Node.js 18+
- MongoDB Atlas account (free tier available)

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3.13 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env

# Edit .env and add your MongoDB Atlas URI and other settings
# Get MongoDB URI from: https://cloud.mongodb.com
```

**Required Environment Variables** (in `backend/.env`):
```
APP_ENV=development
PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/yourdrobe?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRES_IN=604800
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Start the backend server:**
```bash
uvicorn main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🗄️ MongoDB Atlas Setup

1. Create account at [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a new cluster (free tier M0 is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string from the "Connect" button
6. Add the connection string to `backend/.env` as `MONGODB_URI`

## 🧪 Testing the Application

### Backend Health Check

Visit `http://localhost:8000/healthz` to verify:
- Backend is running
- Database connection is established

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### API Documentation

FastAPI provides automatic interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📁 Project Structure

```
yourdrobe/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Settings management with Pydantic
│   ├── database.py          # MongoDB connection with Motor
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables template
│   └── .env                 # Your environment variables (not in git)
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── config/
│   │   │   └── api.ts       # API configuration
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## 🎯 Sprint 0 Status - ✅ COMPLETED

Sprint 0 has been completed with the following deliverables:

- ✅ FastAPI backend structure created
- ✅ MongoDB connection implemented with Motor
- ✅ `/healthz` endpoint with database health check
- ✅ CORS middleware configured for frontend
- ✅ Frontend API configuration created
- ✅ Git repository initialized with proper `.gitignore`
- ✅ Initial commit pushed to `main` branch

## 🔜 Next Steps (Sprint 1)

Sprint 1 will implement:
- User registration (signup)
- User login with JWT tokens
- User logout
- Protected routes and authentication middleware

## 🛠️ Development Workflow

1. Create a `.env` file in the `backend/` directory (copy from `.env.example`)
2. Start the backend server: `uvicorn backend.main:app --reload`
3. Start the frontend dev server: `npm run dev` (in `frontend/` directory)
4. Make changes and test via the frontend UI
5. Commit changes to the `main` branch after testing

## 📝 Notes

- The backend uses async/await with Motor for MongoDB operations
- All passwords will be hashed with Argon2 (Sprint 1+)
- JWT tokens expire after 7 days by default
- CORS is configured to allow requests from the frontend

## 🐛 Troubleshooting

**Backend won't start:**
- Verify Python 3.13+ is installed: `python3 --version`
- Ensure virtual environment is activated
- Check that all dependencies are installed: `pip list`
- Verify `.env` file exists with correct values

**Database connection fails:**
- Verify MongoDB Atlas URI is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions
- Test connection in MongoDB Compass

**Frontend can't connect to backend:**
- Verify backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify `API_BASE_URL` in `frontend/src/config/api.ts`

## 📄 License

This project is part of the YourDrobe application development.# yourdrobe
