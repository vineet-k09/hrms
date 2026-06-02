# test_db.py

from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.db.session import SessionLocal

with SessionLocal() as db:
    print("Connected successfully")