from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey, TIMESTAMP, JSON
from sqlalchemy.dialects.postgresql import UUID
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
    files = relationship("FileMetadata", back_populates="owner")

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
