import boto3
import os

from dotenv import load_dotenv
load_dotenv()


AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

def upload_file_to_s3(file_id: str, encrypted_data: bytes):
    s3_client.put_object(Bucket=AWS_BUCKET_NAME, Key=file_id, Body=encrypted_data)

def download_file_from_s3(file_id: str):
    response = s3_client.get_object(Bucket=AWS_BUCKET_NAME, Key=file_id)
    return response["Body"].read()


if __name__ == "__main__":
    # Test Case
    print("Sucessfully connected to S3")
    upload_file_to_s3("My Test File", b'Hello AWS from Anokxz') 
    print(download_file_from_s3("My Test File")) 
    print("Sucessfully uploaded to S3")
    