from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
import io
from sqlalchemy.orm import Session
import encryption, aws_utils
from database import get_db
from models import FileMetadata, User, SharedFileAccess
import uuid

router = APIRouter()

@router.get("/")
async def get_files(owner_id: int, db: Session = Depends(get_db)):
    files = db.query(FileMetadata).filter(FileMetadata.owner_id == owner_id).all()
    shared_files = (
        db.query(FileMetadata)
        .join(SharedFileAccess, SharedFileAccess.file_id == FileMetadata.id)
        .filter(SharedFileAccess.user_id == owner_id, SharedFileAccess.can_download == True)
        .all()
    )
    file_list = []
    for file in files:
        file_list.append({ "id" : file.id, "name": file.filename, "size" : file.filesize, "created": file.created_at, "owner" : "you"})
    
    for file in shared_files:
        file_list.append({ "id" : file.id, "name": file.filename, "size" : file.filesize, "created": file.created_at, "owner" : file.owner.username})
    
    return file_list

@router.post("/upload/")
async def upload_file(owner_id: int, file: UploadFile = File(...),  db: Session = Depends(get_db)):
    key = encryption.generate_key()
    file_data = await file.read()
    encrypted_data = encryption.encrypt_file(file_data, key)

    file_id = str(uuid.uuid4())
    aws_utils.upload_file_to_s3(file_id, encrypted_data)

    metadata = FileMetadata(id=file_id, owner_id=owner_id, encrypted_key=key, filename=file.filename, filesize=len(file_data))
    db.add(metadata)
    db.commit()

    return {"file_id": file_id}

@router.get("/download/{file_id}")
async def download_file(owner_id: int, file_id: str, db: Session = Depends(get_db)):
    metadata = db.query(FileMetadata).filter_by(id=file_id).first()

    
    if not metadata:
        raise HTTPException(status_code=404, detail="File not found")

    if metadata.owner_id != owner_id:
        # Check shared access
        shared = db.query(SharedFileAccess).filter_by(file_id=file_id, user_id=owner_id, can_download=True).first()
        if not shared:
            raise HTTPException(status_code=403, detail="You don’t have permission to download this file")
    
    encrypted_data = aws_utils.download_file_from_s3(file_id)
    decrypted_data = encryption.decrypt_file(encrypted_data, metadata.encrypted_key)

    # Convert decrypted data to BytesIO for streaming response
    file_stream = io.BytesIO(decrypted_data)

    # Return response with correct headers
    return StreamingResponse(
        file_stream,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{metadata.filename}"'}
    )
    

@router.delete("/delete/{file_id}")
async def delete_file(owner_id: int, file_id: str, db: Session = Depends(get_db)):
    # Check if file exists in the database and belongs to the owner
    metadata = db.query(FileMetadata).filter_by(id=file_id, owner_id=owner_id).first()
    if not metadata:
        raise HTTPException(status_code=404, detail="File not found or unauthorized")

    # Attempt to delete the file from S3
    aws_status_code = aws_utils.delete_file_from_s3(file_id)

    if aws_status_code == 204:  # Successful deletion
        db.delete(metadata)  # Remove file record from database
        db.commit()  # Save changes to PostgreSQL
        return {"status": True, "message": "File successfully deleted"}

    raise HTTPException(status_code=500, detail="Failed to delete file from S3")

@router.post("/share")
def share_file_access(file_id: uuid.UUID, target_user_id: int, db: Session = Depends(get_db)):
    shared = SharedFileAccess(file_id=file_id, user_id=target_user_id, can_download=True)
    db.add(shared)
    db.commit()
    return {"message": "File shared successfully"}

if __name__ == "__main__":
    pass