from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Feedback
from schemas import FeedbackCreate, FeedbackOut
from typing import List

router = APIRouter()

@router.post("/", response_model= FeedbackOut)
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = Feedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/", response_model=List[FeedbackOut])
def get_all_feedback(db: Session = Depends(get_db)):
    return db.query(Feedback).all()
