import zipfile
import tempfile
import os
import shutil
from typing import List
from fastapi import UploadFile, HTTPException


def extract_pdfs_from_zip(zip_file: UploadFile) -> tuple[str, List[str]]:
    """
    Accepts an uploaded ZIP file, extracts it to a temp directory, and returns a list of absolute paths to all .pdf files found.

    Returns:
        (temp_dir: str, pdf_paths: List[str])
        Caller is responsible for cleaning up temp_dir after use.

    Raises:
        HTTPException 400 if file is not a valid ZIP or contains no PDFs.
        HTTPException 400 if number of PDFs is outside the allowed range.
    """
    # Create a secure temporary directory
    temp_dir = tempfile.mkdtemp(prefix="resume_batch_")

    try:
        # Read uploaded bytes into memory
        zip_file.file.seek(0)  # reset file pointer
        zip_bytes = zip_file.file.read()

        zip_path = os.path.join(temp_dir, "upload.zip")
        with open(zip_path, "wb") as f:
            f.write(zip_bytes)

        # Validate it's a real ZIP
        if not zipfile.is_zipfile(zip_path):
            shutil.rmtree(temp_dir, ignore_errors=True)
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is not a valid ZIP archive."
            )

        extract_dir = os.path.join(temp_dir, "extracted")
        os.makedirs(extract_dir, exist_ok=True)

        with zipfile.ZipFile(zip_path, "r") as zf:
            # Security: skip absolute paths and directory traversal
            for member in zf.infolist():
                filename = os.path.normpath(member.filename)

                # Skip unsafe paths
                if filename.startswith("..") or os.path.isabs(filename):
                    continue

                target_path = os.path.join(extract_dir, filename)
                target_path = os.path.realpath(target_path)

                if not target_path.startswith(os.path.realpath(extract_dir)):
                    continue  # Skip unsafe paths
                zf.extract(member, extract_dir)

        # Walk extracted directory and collect only PDFs
        pdf_paths: List[str] = []
        for root, _dirs, files in os.walk(extract_dir):
            for fname in files:
                if fname.lower().endswith(".pdf") and not fname.startswith("__MACOSX"):
                    full_path = os.path.join(root, fname)
                    pdf_paths.append(full_path)

        # Check PDF count
        num_pdfs = len(pdf_paths)
        if num_pdfs < 5  or num_pdfs > 40:
            shutil.rmtree(temp_dir, ignore_errors=True)
            raise HTTPException(
                status_code=400,
                detail=f"Number of PDF files must be between 25 and 40. Found {num_pdfs}."
            )

        if not pdf_paths:
            shutil.rmtree(temp_dir, ignore_errors=True)
            raise HTTPException(
                status_code=400,
                detail="No PDF files found inside the ZIP archive."
            )

        # Sort for deterministic ordering
        pdf_paths.sort()

        return temp_dir, pdf_paths

    except HTTPException:
        raise
    except Exception as e:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process ZIP file: {str(e)}"
        )


def cleanup_temp_dir(temp_dir: str) -> None:
    """
    Safely removes the temporary directory created during extraction.
    Should be called in a finally block after pipeline completes.
    """
    if temp_dir and os.path.exists(temp_dir):
        shutil.rmtree(temp_dir, ignore_errors=True)