# from database import Base

# print("Before:", Base.metadata.tables.keys())

# from models import *

# print("After:", Base.metadata.tables.keys())

from dotenv import load_dotenv
import os

load_dotenv()

print(os.getenv("DATABASE_URL"))