from pydantic import BaseModel


class Settings(BaseModel):
    DATABASE_URL: str = "mongodb://localhost:27017/"
    MONGO_INITDB_DATABASE: str = "quiz_db"

    SECRET_KEY : str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM : str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES : int = 30
  


settings = Settings()
