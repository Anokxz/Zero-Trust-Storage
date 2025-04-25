from pydantic import BaseModel

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
    access_token: str
    token_type: str

class FeedbackCreate(BaseModel):
    user_id: int
    rating: int
    feedback: str

class FeedbackOut(BaseModel):
    id: int
    user_id: int
    rating: int
    feedback: str