import os
import uuid

import boto3
from botocore.exceptions import ClientError
from fastapi import HTTPException, UploadFile

# TODO: Use these two functions to integrate with candidate application so that when candidate apply for jobs thier resume gets uploaded - store the key and link of file both in the backend, use key later on if hr wants to delete resume of old applications

BUCKET_NAME = os.getenv("BUCKET0_BUCKET")
ENDPOINT = os.getenv("BUCKET0_ENDPOINT", "https://s3.bucket0.com")

s3 = boto3.client(
    "s3",
    endpoint_url=ENDPOINT,
    aws_access_key_id=os.getenv("BUCKET0_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("BUCKET0_SECRET_KEY"),
    region_name="auto",
)


async def upload_pdf(file: UploadFile):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed",
        )

    key = f"pdfs/{uuid.uuid4()}.pdf"

    try:
        s3.upload_fileobj(
            file.file,
            BUCKET_NAME,
            key,
            ExtraArgs={
                "ContentType": "application/pdf"
            }
        )

        return {
            "key": key,
            "url": f"{ENDPOINT}/{BUCKET_NAME}/{key}",
        }

    except ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


def delete_file(key: str):
    try:
        s3.delete_object(
            Bucket=BUCKET_NAME,
            Key=key,
        )

        return {
            "success": True,
            "deleted_key": key,
        }

    except ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
    


# from fastapi import APIRouter, File, UploadFile

# from helper.storage import upload_pdf

# router = APIRouter()


# @router.post("/upload-pdf")
# async def upload_pdf_endpoint(
#     file: UploadFile = File(...)
# ):
#     url = await upload_pdf(file)

#     return {
#         "success": True,
#         "url": url
#     }
#  res[pseeee]

# from fastapi import APIRouter, File, UploadFile

# from app.storage import upload_pdf, delete_file

# router = APIRouter(prefix="/files", tags=["Files"])


# @router.post("/upload")
# async def upload(file: UploadFile = File(...)):
#     return await upload_pdf(file)

# {
#   "key": "pdfs/fd6cb92e-cbf7-42a8-a34e-2bc6c865b1a0.pdf",
#   "url": "https://s3.bucket0.com/mybucket/pdfs/fd6cb92e-cbf7-42a8-a34e-2bc6c865b1a0.pdf"
# }
# @router.delete("/{key:path}")
# async def delete(key: str):
#     return delete_file(key)
# {
#   "success": true,
#   "url": "https://s3.bucket0.com/mybucket/pdfs/3a5f1c9f-d6d7-4ef3-b56b-f0c8f24d1d4d.pdf"
# }

# DELETE /files/pdfs/fd6cb92e-cbf7-42a8-a34e-2bc6c865b1a0.pdf
# {
#   "success": true,
#   "deleted_key": "pdfs/fd6cb92e-cbf7-42a8-a34e-2bc6c865b1a0.pdf"
# }