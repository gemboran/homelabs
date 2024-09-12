import { registerOTel } from '@vercel/otel';
import { traceExporter } from './instrumentation.node';
import config from "@/config";

export function register() {
  registerOTel({
    serviceName: config.appName,
    traceExporter: traceExporter,
  });
}
