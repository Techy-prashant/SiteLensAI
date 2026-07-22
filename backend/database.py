import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Use DATABASE_URL from env when available, otherwise default to local docker-compose Postgres.
DEFAULT_DB_URL = (
    "postgresql+psycopg2://"
    "sitelens:sitelens"
    "@localhost:5432/sitelens"
)
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
