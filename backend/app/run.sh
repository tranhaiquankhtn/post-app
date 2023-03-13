#! /usr/bin/env bash

# Check DB is UP or not
python /app/app/prestart.py

# Run migrations
alembic upgrade head

uvicorn app.main:app --log-level debug --host 0.0.0.0 --port 80 --proxy-headers
