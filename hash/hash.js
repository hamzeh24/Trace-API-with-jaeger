const express = require("express");
const crypto = require("crypto");
const { register, Counter, Histogram } = require("prom-client");
const { tracer, provider } = require("./tracer");
const { context, trace } = require("@opentelemetry/api");

const app = express();
const PORT = 3000;

app.use(express.json());

// ✅ Define Prometheus metrics
const requestCount = new Counter({
  name: "hash_request_count",
  help: "Total number of hash requests",
  labelNames: ["method", "status"],
});

const errorCount = new Counter({
  name: "hash_error_count",
  help: "Total number of hash errors",
  labelNames: ["method", "status"],
});

const requestDuration = new Histogram({
  name: "hash_request_duration_seconds",
  help: "Request duration in seconds",
  labelNames: ["method"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ✅ Hash endpoint with tracing + Prometheus metrics
app.post("/hash", (req, res) => {
  console.log(`Reached hash service`);
  const start = process.hrtime(); // Start timing

  // Start a new tracing span
  const span = tracer.startSpan("hash-endpoint");

  try {
    const { input } = req.query;

    if (!input) {
      span.setAttribute("error", true);
      span.setAttribute("error.message", "Input is required");
      errorCount.inc({ method: req.method, status: "400" }); // ✅ Track bad requests

      span.end();
      return res.status(400).json({ error: "Input is required" });
    }

    const hash = crypto.createHash("sha256").update(input).digest("hex");

    // ✅ Record request count
    requestCount.inc({ method: req.method, status: "200" });

    // ✅ Record request duration
    const duration = process.hrtime(start);
    const seconds = duration[0] + duration[1] / 1e9;
    requestDuration.observe({ method: req.method }, seconds);

    // ✅ Corrected tracing propagation issue
    context.with(trace.setSpan(context.active(), span), () => {
      span.end();
      provider
        .forceFlush()
        .then(() => {
          console.log("✅ Traces flushed to Jaeger");
        })
        .catch((err) => {
          console.error("❌ Error flushing traces to Jaeger:", err);
        });
    });

    res.json({ hash });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    span.recordException(error);
    span.setAttribute("error", true);
    errorCount.inc({ method: req.method, status: "500" }); // ✅ Track internal server errors

    span.end();
    provider
      .forceFlush()
      .then(() => console.log("✅ Traces flushed to Jaeger (error case)"))
      .catch((err) => console.error("❌ Error flushing traces to Jaeger:", err));

    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
