const express = require("express");
const { tracer } = require("./tracer"); // ✅ Import tracer
const { provider } = require("./tracer"); // ✅ Import provider for forceFlush
const { context, trace } = require("@opentelemetry/api");
const { register, Counter, Histogram } = require("prom-client");

const app = express();
const PORT = 3001;

app.use(express.json());

// ✅ Define Prometheus metrics with labels
const requestCount = new Counter({
  name: "length_request_count",
  help: "Total number of length requests",
  labelNames: ["method", "status"],
});

const errorCount = new Counter({
  name: "length_error_count",
  help: "Total number of length errors",
  labelNames: ["method", "status"],
});

const requestDuration = new Histogram({
  name: "length_request_duration_seconds",
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

// ✅ Length endpoint with tracing and metrics
app.post("/length", (req, res) => {
  console.log(`Reached length service`);
  const start = process.hrtime(); // Start timing

  if (!tracer || typeof tracer.startSpan !== "function") {
    console.error("❌ Tracer is not initialized correctly!");
    errorCount.inc({ method: req.method, status: "500" }); // Log error
    return res.status(500).json({ error: "Tracing not working" });
  }

  const span = tracer.startSpan("length-endpoint");
  console.log("Trace Span Created:", span.spanContext());

  const { input } = req.query;
  console.log("Input: " + input);

  if (!input) {
    span.end();
    errorCount.inc({ method: req.method, status: "400" }); // Log error
    return res.status(400).json({ error: "Input is required" });
  }

  const length = input.length;
  console.log("Length: " + length);

  // ✅ Record request count with method and status labels
  requestCount.inc({ method: req.method, status: "200" });

  // ✅ Record request duration
  const duration = process.hrtime(start);
  const seconds = duration[0] + duration[1] / 1e9;
  requestDuration.observe({ method: req.method }, seconds);

  // ✅ Propagation with tracing
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

  res.json({ length });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
