from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserResponse, Token, UserLogin
from auth import hash_password, verify_password, create_access_token
from datetime import timedelta

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": db_user.email}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(authorization: str = Header(None)):
    """Middleware to extract and verify token from Authorization header."""
    if not authorization:
        raise HTTPException(status_code=403, detail="Token is missing")
    
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=403, detail="Invalid token scheme")

    user_data = verify_token(token)
    if not user_data:
        raise HTTPException(status_code=403, detail="Invalid or expired token")

    return user_data

@router.post("/downloads_count")
def total_download(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id)
    
    return { "downloads": db_user.first().total_downloads if db_user else -1 }
