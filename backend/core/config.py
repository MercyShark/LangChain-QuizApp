from pydantic import BaseModel
import os 

class Settings(BaseModel):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    MONGO_INITDB_DATABASE: str = os.getenv("MONGO_INITDB_DATABASE")

    SECRET_KEY : str = os.getenv("SECRET_KEY")
    ALGORITHM : str = os.getenv("JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES : int = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
  
settings = Settings()
