from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User
from schemas import UserCreate, UserResponse
# from auth import get_password_hash, verify_password, create_access_token
from routes import files, users, feedback


app = FastAPI()

## Enabling (Cross-Origin Resource Sharing)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow only your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)


Base.metadata.create_all(bind=engine)

app.include_router(users.router, prefix="/user", tags=["Authentication"])
app.include_router(files.router, prefix="/files", tags=["File Handling"])
app.include_router(feedback.router, prefix="/feedback", tags=["Feeback Handling"])
@app.get("/")
def root():
    return {"message": "Secure File Storage API is running!"}

if __name__ == "__main__":
    pass