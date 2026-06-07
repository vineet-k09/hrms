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
    if not BUCKET_NAME:
        raise HTTPException(
            status_code=500,
            detail="Storage bucket is not configured",
        )

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed",
        )

    key = f"pdfs/{uuid.uuid4()}.pdf"

    try:
        file.file.seek(0)
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
    if not BUCKET_NAME:
        raise HTTPException(
            status_code=500,
            detail="Storage bucket is not configured",
        )

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