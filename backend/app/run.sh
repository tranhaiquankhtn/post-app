#!/bin/bash

uvicorn app.main:app --log-level debug --host 0.0.0.0 --port 8080 --reload
