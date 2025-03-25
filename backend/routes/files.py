from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Response
from sqlalchemy.orm import Session
import encryption, aws_utils
from database import get_db
from models import FileMetadata, User
import uuid

router = APIRouter()

@router.get("/")
async def get_files(owner_id: int = 1, db: Session = Depends(get_db)):
    files = db.query(FileMetadata).filter(FileMetadata.owner_id == owner_id).all()
    
    file_list = []
    for file in files:
        file_list.append({"name": file.filename, "id" : file.id})
    return file_list

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...), owner_id: int = 1, db: Session = Depends(get_db)):
    key = encryption.generate_key()
    file_data = await file.read()
    encrypted_data = encryption.encrypt_file(file_data, key)

    file_id = str(uuid.uuid4())
    aws_utils.upload_file_to_s3(file_id, encrypted_data)

    metadata = FileMetadata(id=file_id, owner_id=owner_id, encrypted_key=key, filename=file.filename)
    db.add(metadata)
    db.commit()

    return {"file_id": file_id}

@router.get("/download/{file_id}")
async def download_file(file_id: str, owner_id: int = 1, db: Session = Depends(get_db)):
    metadata = db.query(FileMetadata).filter_by(id=file_id, owner_id=owner_id).first()
    if not metadata:
        raise HTTPException(status_code=404, detail="File not found or unauthorized")

    encrypted_data = aws_utils.download_file_from_s3(file_id)
    decrypted_data = encryption.decrypt_file(encrypted_data, metadata.encrypted_key)
    
    return decrypted_data.decode()

if __name__ == "__main__":
    pass