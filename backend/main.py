from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from database import connect_to_mongo, close_mongo_connection, get_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="YourDrobe API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# (No routers currently registered)


@app.get("/healthz")
async def health_check():
    """Health check endpoint that verifies database connection."""
    try:
        db = await get_database()
        # Ping the database to verify connection
        await db.command("ping")
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "YourDrobe API",
        "version": "1.0.0",
        "docs": "/docs"
    }