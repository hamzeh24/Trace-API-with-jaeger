const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { trace } = require("@opentelemetry/api");

// ✅ Initialize Tracer Provider
const provider = new NodeTracerProvider();
const exporter = new JaegerExporter({
  endpoint: "http://host.docker.internal:14268/api/traces", // Make sure this endpoint is correct
});

// ✅ Use BatchSpanProcessor (better performance)
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();

console.log("✅ OpenTelemetry Tracing Initialized");

// ✅ Correctly export the tracer
const tracer = trace.getTracer("express-app");

module.exports = { tracer, provider }; // ✅ Ensure `tracer` is exported
