from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_size=5,        # connessioni sempre pronte
    max_overflow=10,    # extra temporanee
    pool_timeout=30,    # secondi di attesa
    pool_recycle=1800,  # ricrea connessioni vecchie
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
