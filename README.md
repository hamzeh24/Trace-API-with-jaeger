# 🚀 Microservices Observability Project  

## 📌 Overview  
This project consists of two **Node.js microservices**, **Hash Service** and **Length Service**, with built-in **observability features** using **Prometheus** for monitoring and **Jaeger** for distributed tracing.  

## 🏗️ Architecture  
- **Hash Service** (`hash.js`) - Computes SHA-256 hashes for input strings.  
- **Length Service** (`length.js`) - Computes the length of input strings.  
- **Prometheus** - Monitors API metrics such as request count, request duration, and error count.  
- **Jaeger** - Captures and visualizes distributed traces for API calls.  
- **Docker** - Services run inside containers for easy deployment.  

## 🎯 Features  
✅ **String Processing**: Hashing & length calculation.  
✅ **Health Checks**: `/health` endpoints for service status.  
✅ **Observability**:  
  - 📊 **Prometheus Metrics** for monitoring.  
  - 📡 **Jaeger Tracing** for distributed debugging.  

## 🛠️ API Endpoints  

### 🚀 Hash Service (`hash.js`)  
| Method | Endpoint | Description |  
|--------|----------|-------------|  
| `GET`  | `/health` | Health check (returns `{"status": "ok"}`) |  
| `POST` | `/hash?input=your_text` | Returns SHA-256 hash of `your_text` |  
| `GET`  | `/metrics` | Exposes Prometheus metrics |  

### 🚀 Length Service (`length.js`)  
| Method | Endpoint | Description |  
|--------|----------|-------------|  
| `GET`  | `/health` | Health check (returns `{"status": "ok"}`) |  
| `POST` | `/length?input=your_text` | Returns length of `your_text` |  
| `GET`  | `/metrics` | Exposes Prometheus metrics |  

## 📊 Prometheus Metrics  
| Service | Metric Name | Description |  
|---------|------------|------------|  
| **Hash** | `hash_request_count` | Total number of hash requests |  
| **Hash** | `hash_error_count` | Total number of failed hash requests |  
| **Hash** | `hash_request_duration_seconds` | Request duration in seconds |  
| **Length** | `length_request_count` | Total number of length requests |  
| **Length** | `length_error_count` | Total number of failed length requests |  
| **Length** | `length_request_duration_seconds` | Request duration in seconds |  

## 📡 Jaeger Tracing  
Each request is traced using **OpenTelemetry**, and traces are exported to **Jaeger**.  

## 🏗️ Running the Project  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/hamzeh24/Trace-API-with-jaeger.git
cd your-repo
