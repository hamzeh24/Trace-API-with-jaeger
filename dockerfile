# Use the official Python image
FROM python:3.10

# Set the working directory
WORKDIR /app


# Copy the application files
COPY . .

# Install dependencies, including OpenTelemetry
RUN pip install --no-cache-dir fastapi uvicorn \
    opentelemetry-api opentelemetry-sdk \
    opentelemetry-exporter-otlp \
    opentelemetry-instrumentation-fastapi \
    prometheus-fastapi-instrumentator

# Expose the application port
EXPOSE 8000

# Run the FastAPI application
CMD ["python", "hash_service.py"]
