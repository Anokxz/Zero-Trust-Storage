from pydantic import BaseModel
from uuid import UUID

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    user_name: str 
    user_id : int
    access_token: str
    token_type: str

class ShareRequest(BaseModel):
    file_id: UUID
    shared_user_id: int
    
class FeedbackCreate(BaseModel):
    user_id: int
    rating: int
    feedback: str

class FeedbackOut(BaseModel):
    id: int
    user_id: int
    rating: int
    feedback: str