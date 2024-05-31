import uvicorn
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from services.auth import router as AuthRouter
from services.quiz import router as QuizRouter

app = FastAPI()
app.include_router(AuthRouter, prefix="/auth", tags=["auth"])
app.include_router(QuizRouter, prefix="/quiz", tags=["quiz"])

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],allow_credentials=True,)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
