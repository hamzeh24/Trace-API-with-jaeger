📌 Overview
The Hash Service is a simple Node.js application that exposes an API for generating SHA-256 hashes of input strings.
It also includes observability features such as Prometheus metrics for monitoring and Jaeger tracing for distributed tracing.

🎯 Features
SHA-256 Hashing: Accepts an input string and returns its SHA-256 hash.
Health Check Endpoint: Provides a /health endpoint to verify the service status.

Observability:
📊 Prometheus Metrics: Collects request count, request duration, and error count.
📡 Jaeger Tracing: Traces API requests for distributed system debugging.

🛠️ Endpoints

GET	/health	Checks service health (returns {"status": "ok"})
POST	/hash?input=your_text	Returns the SHA-256 hash of your_text
GET	/metrics	Exposes Prometheus metrics for monitoring

📊 Prometheus Metrics
Metric Name	Description
hash_request_count:	Counts the total number of hash requests (labeled by method & status)
hash_error_count:	Counts the number of failed hash requests (labeled by method)
hash_request_duration_seconds:	Measures request duration (labeled by method)

📡 Jaeger Tracing
Each request is traced with OpenTelemetry, and spans are exported to Jaeger.

🏗️ Running the Service
docker build -t hash-service .
docker run -p 3000:3000 hash-service

📌 Notes
Ensure edit prometheus.yml to add the service name or container IP
  - job_name: "hash"
    static_configs:
      - targets: ["container IP:3000"]

  - job_name: "length"
    static_configs:
      - targets: ["container IP:3001"]
