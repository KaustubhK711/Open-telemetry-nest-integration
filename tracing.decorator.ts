import { SpanKind, SpanStatusCode, trace, context } from '@opentelemetry/api';
//import { Tracer } from 'dd-trace';
//import { context } from '@opentelemetry/api';

export function TraceMethod(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    const tracer = trace.getTracer('your-service-name');

    //  const active_span = type ? type : null;
    descriptor.value = async function (...args: any[]) {
      const span = tracer.startSpan(
        `${target.constructor.name}.${propertyKey}`,
        {
          kind: SpanKind.SERVER,
          //   parent: active_span
        },
        context.active(),
      );

      span.setAttributes({
        'controller.name': target.constructor.name,
        'method.name': propertyKey,
      });

      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        throw error;
      } finally {
        span.end();
      }
    };
    return descriptor;
  };
}
