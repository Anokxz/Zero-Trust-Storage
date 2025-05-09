from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey, TIMESTAMP, JSON
from sqlalchemy.dialects.postgresql import UUID, BOOLEAN
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    email = Column(String, nullable=False)
    total_downloads = Column(Integer, nullable=False, default=0)
    files = relationship("FileMetadata", back_populates="owner")
    feedbacks = relationship("Feedback", back_populates="user") 
    
class FileMetadata(Base):
    __tablename__ = "files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    encrypted_key = Column(LargeBinary, nullable=False)
    filename = Column(String, nullable=False)
    filemeta = Column(String, nullable=True)
    filesize = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=func.now())
    shared_access = Column(JSON, nullable=True)
    owner = relationship("User", back_populates="files")


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    feedback = Column(String, nullable=False)

    user = relationship("User", back_populates="feedbacks")
    
class SharedFileAccess(Base):
    __tablename__ = "file_shares"
    id = Column(Integer, primary_key=True)
    file_id = Column(UUID(as_uuid=True), ForeignKey("files.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    can_download = Column(BOOLEAN, default=True)

    file = relationship("FileMetadata", backref="shared_users")
    user = relationship("User")