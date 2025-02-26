📌 Overview
The Length Service is a simple Node.js API that calculates the length of a given input string. It includes observability features such as Prometheus metrics for monitoring and Jaeger tracing for distributed tracing.

🎯 Features
String Length Calculation: Accepts an input string and returns its length.
Health Check Endpoint: Provides a /health endpoint to verify the service status.
Observability:
📊 Prometheus Metrics: Collects request count, request duration, and error count.
📡 Jaeger Tracing: Traces API requests for distributed system debugging.
🛠️ Endpoints
Method	Endpoint	Description
GET	/health	Checks service health (returns {"status": "ok"})
POST	/length?input=your_text	Returns the length of your_text
GET	/metrics	Exposes Prometheus metrics for monitoring
📊 Prometheus Metrics
Metric Name	Description
length_request_count	Counts the total number of length requests (labeled by method & status)
length_error_count	Counts the number of failed length requests (labeled by method)
length_request_duration_seconds	Measures request duration (labeled by method)
📡 Jaeger Tracing
Each request is traced with OpenTelemetry, and spans are exported to Jaeger.

🏗️ Running the Service
With Docker:
sh
Copy
Edit
docker build -t length-service .  
docker run -p 3001:3001 length-service  
With Node.js:
sh
Copy
Edit
npm install  
node length.js  
📌 Notes
Ensure Prometheus scrapes the /metrics endpoint.
The service is intended to be used with Jaeger for tracing and Prometheus for monitoring.