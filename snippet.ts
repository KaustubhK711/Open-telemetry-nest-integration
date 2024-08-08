import { SpanKind } from '@opentelemetry/api';
import { trace, propagation, context } from '@opentelemetry/api';

const tracer = trace.getTracer('your-service-name');
const extracedContext = propagation.extract(
  context.active(),
  webhookOrderRequest?.trace_context,
);
context.with(extracedContext, () => {
  tracer.startActiveSpan(
    `${this.constructor.name}.you-method-name`,
    {
      kind: SpanKind.SERVER,
      attributes: {
        'controller.name': this.constructor.name,
        'method.name': 'your-method-name',
      },
    },
    async (span) => {
      // Add your method logic here
      // It will trace everything that is here
      span.end();
    }
  )
})
