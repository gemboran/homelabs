'use strict'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {diag, DiagConsoleLogger, DiagLogLevel} from "@opentelemetry/api";
import config from "@/config";

// Add otel logging
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR); // set diaglog level to DEBUG when debugging

const exporterOptions = {
  url: config.signozUrl, // Set your own data region or set to http://localhost:4318/v1/traces if using selfhost SigNoz
  headers: { 'signoz-access-token': config.signozAccessToken }, // Set if you are using SigNoz Cloud
}

export const traceExporter = new OTLPTraceExporter(exporterOptions);
