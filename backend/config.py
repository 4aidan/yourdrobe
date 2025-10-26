from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    APP_ENV: str = "development"
    PORT: int = 8000
    MONGODB_URI: str
    JWT_SECRET: str
    JWT_EXPIRES_IN: int = 604800  # 7 days in seconds
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.APP_ENV == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.APP_ENV == "production"


# Create a global settings instance
settings = Settings()