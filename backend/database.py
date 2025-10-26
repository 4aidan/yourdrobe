from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import settings
import logging

logger = logging.getLogger(__name__)

# Global MongoDB client
mongodb_client: AsyncIOMotorClient | None = None


async def connect_to_mongo() -> None:
    """
    Connect to MongoDB Atlas using Motor async client.
    Called during application startup.
    """
    global mongodb_client
    
    try:
        logger.info("Connecting to MongoDB...")
        mongodb_client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            maxPoolSize=10,
            minPoolSize=1,
            serverSelectionTimeoutMS=5000
        )
        
        # Verify connection by pinging the database
        await mongodb_client.admin.command("ping")
        logger.info("Successfully connected to MongoDB")
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise


async def close_mongo_connection() -> None:
    """
    Close MongoDB connection.
    Called during application shutdown.
    """
    global mongodb_client
    
    if mongodb_client:
        logger.info("Closing MongoDB connection...")
        mongodb_client.close()
        mongodb_client = None
        logger.info("MongoDB connection closed")


async def get_database() -> AsyncIOMotorDatabase:
    """
    Get the MongoDB database instance.
    
    Returns:
        AsyncIOMotorDatabase: The database instance
        
    Raises:
        RuntimeError: If database connection is not established
    """
    if mongodb_client is None:
        raise RuntimeError("Database connection not established. Call connect_to_mongo() first.")
    
    # Extract database name from URI or use default
    return mongodb_client.yourdrobe


def get_collection(collection_name: str):
    """
    Get a MongoDB collection.
    
    Args:
        collection_name: Name of the collection
        
    Returns:
        AsyncIOMotorCollection: The collection instance
    """
    if mongodb_client is None:
        raise RuntimeError("Database connection not established. Call connect_to_mongo() first.")
    
    db = mongodb_client.yourdrobe
    return db[collection_name]