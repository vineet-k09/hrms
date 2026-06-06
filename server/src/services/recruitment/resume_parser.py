"""
resume_parser.py
Location: server/src/services/recruitment/resume_parser.py

Extracts clean text from PDF resumes using PyMuPDF (fitz).
"""

import os
import re
from typing import Dict, List

try:
    import fitz  # PyMuPDF
except ImportError:
    raise ImportError(
        "PyMuPDF is required. Install it with: pip install pymupdf"
    )


def extract_text_from_pdf(pdf_path: str) -> Dict[str, str]:
    """
    Extracts and cleans all text from a single PDF file.

    Args:
        pdf_path: Absolute path to the PDF file.

    Returns:
        {
            "filename": "john_doe.pdf",
            "text": "full extracted resume text...",
            "page_count": 2,
            "error": None   # or error message string if extraction failed
        }
    """
    filename = os.path.basename(pdf_path)
    result = {
        "filename": filename,
        "text": "",
        "page_count": 0,
        "error": None,
    }

    try:
        doc = fitz.open(pdf_path)
        result["page_count"] = doc.page_count

        raw_pages = []
        for page_num in range(doc.page_count):
            page = doc.load_page(page_num)
            page_text = page.get_text("text")  # plain text mode
            if page_text.strip():
                raw_pages.append(page_text)

        doc.close()

        if not raw_pages:
            result["error"] = "PDF appears to be empty or image-only (no selectable text)."
            return result

        combined = "\n".join(raw_pages)
        result["text"] = _clean_text(combined)

    except Exception as e:
        result["error"] = f"Failed to parse PDF: {str(e)}"

    return result


def _clean_text(raw: str) -> str:
    """
    Cleans raw extracted PDF text:
    - Normalises line endings
    - Collapses excessive blank lines (max 2 in a row)
    - Strips leading/trailing whitespace per line
    - Removes null bytes and non-printable characters (except newlines/tabs)
    """
    # Remove null bytes
    text = raw.replace("\x00", "")

    # Normalise line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Strip each line
    lines = [line.strip() for line in text.split("\n")]

    # Collapse runs of blank lines to max 2
    cleaned_lines = []
    blank_streak = 0
    for line in lines:
        if line == "":
            blank_streak += 1
            if blank_streak <= 2:
                cleaned_lines.append("")
        else:
            blank_streak = 0
            cleaned_lines.append(line)

    result = "\n".join(cleaned_lines).strip()

    # Remove any remaining non-printable chars except whitespace
    result = re.sub(r"[^\x09\x0A\x20-\x7E\u00A0-\uFFFF]", "", result)

    return result


def parse_all_resumes(pdf_paths: List[str]) -> List[Dict[str, str]]:
    """
    Batch-parses all PDFs in the given list.

    Args:
        pdf_paths: List of absolute PDF file paths.

    Returns:
        List of extraction results (dicts), one per PDF.
        Entries with errors still appear in the list so the caller
        can decide how to handle them (skip or mark as failed).
    """
    results = []
    for path in pdf_paths:
        parsed = extract_text_from_pdf(path)
        results.append(parsed)
    return results
