from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URL,
    echo_pool=True,
    pool_pre_ping=True,
    pool_size=100,
    max_overflow=50,
    pool_recyle=3600,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=True, bind=engine)
