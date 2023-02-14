import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

logger = logging.getLogger(__name__)

logger.info(f'Connected to DB={settings.SQLALCHEMY_DATABASE_URL}')

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URL,
    echo_pool=True,
    pool_pre_ping=True,
    pool_size=100,
    max_overflow=50,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=True, bind=engine)
