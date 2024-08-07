import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_SERVICE_NAME,
} from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { trace } from '@opentelemetry/api';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';

export function startTracing() {
  const exporter = new OTLPTraceExporter({
    url: `your-otlp-exporter-url`,
  });
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'your-service-name',
      [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: 'your-environment',
      //   [SemanticResourceAttributes.SERVICE_VERSION]:
      //    process.env.DD_VERSION ?? '',
    }),
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();

  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation({
        ignoreOutgoingRequestHook: () => true,
      }),

      new ExpressInstrumentation(),
      new NestInstrumentation(),
      new WinstonInstrumentation({
        // Optional hook to insert additional context to log metadata.
        // Called after trace context is injected to metadata.
        enabled: true,
        logHook: (span, record) => {
          record['resource.service.name'] = 'your-service-name';
        },
      }),
    ],
    tracerProvider: provider,
  });

  return trace.getTracer('your-service-name');
}

export const tracer = trace.getTracer('@opentelemetry/instrumentation');
