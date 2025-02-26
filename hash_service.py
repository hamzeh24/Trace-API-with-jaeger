from fastapi import FastAPI, HTTPException
import hashlib
import logging

# OpenTelemetry Imports
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter  # <-- Use OTLP HTTP exporter
from prometheus_fastapi_instrumentator import Instrumentator

# Set up basic logging configuration for debugging
logging.basicConfig(level=logging.DEBUG)

# Configure OpenTelemetry Tracer Provider
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Export traces to Jaeger using OTLP/HTTP
jaeger_exporter = OTLPSpanExporter(
    endpoint="http://jaeger-hotrod.jaeger.svc.cluster.local:4318"
)

# Add the exporter to the tracer provider
trace.get_tracer_provider().add_span_processor(BatchSpanProcessor(jaeger_exporter))

# Initialize FastAPI
hash_app = FastAPI()

# Instrument FastAPI with OpenTelemetry
FastAPIInstrumentor.instrument_app(hash_app)

# Expose Prometheus metrics
Instrumentator().instrument(hash_app).expose(hash_app)

@hash_app.post("/hash")
def generate_hash(input_string: str):
    logging.debug("Starting the hash generation request")
    
    # Creating a span for the hash generation operation
    with tracer.start_as_current_span("generate_hash") as span:
        logging.debug("Span started for hash generation")

        if not input_string:
            logging.error("Input string is empty, raising HTTP 400 error")
            raise HTTPException(status_code=400, detail="Input string cannot be empty")
        
        # Generate the hash of the input string
        hash_value = hashlib.sha256(input_string.encode()).hexdigest()
        logging.debug("Generated hash: %s", hash_value)
        
        # Returning the result with the generated hash value
        return {"input": input_string, "hash": hash_value}

@hash_app.get("/health")
def health():
    return {"status": "up"}

if __name__ == "__main__":
    import uvicorn
    logging.debug("Starting FastAPI server...")
    uvicorn.run(hash_app, host="0.0.0.0", port=8000)
