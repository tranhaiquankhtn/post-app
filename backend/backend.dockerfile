FROM python:3.11-slim

RUN set -eux; \
    \
    apt-get update; \
    apt-get install -y --no-install-recommends curl

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false


# install dependencies
COPY ./app/pyproject.toml ./app/poetry.lock* /app/

WORKDIR /app
RUN bash -c "poetry install --without dev --no-root"

COPY ./app /app
ENV PYTHONPATH=/app

ENTRYPOINT bash -c "/app/run.sh"
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--proxy-headers"]
