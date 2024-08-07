# Open-telemetry-nest-integration
Open Telemetry Integration in Nest or Node


# Configuration to start exporting the traces for your application

Add import below statement 
import { startTracing } from './tracing';

Add below method call inside boostrap() or start function of your app
startTracing();

Import below statement in your all controller files where you want traces
import { TraceMethod } from '../../../decorators/tracing.decorator';

Add below custom decorator above all the APIs that you wanted to trace
@TraceMethod()

Add below import statement inside your app.module file
import { TracingMiddleware } from './middlewares/tracing.middleware';

Configure the tracing middleware inside your app.module file by calling below class
TracingMiddleware

# Trace lifecycle of request in one root span and multiple child spans

To trace the request end-to-end in one span and respective services/workers that are calling by request into child spans
Add below code inside your services and workers

Import the below statement inside your services from where you want traces
import { SpanKind, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('your-service-name');
tracer.startActiveSpan(
  `${this.constructor.name}.your-method-name`,
  { kind: SpanKind.SERVER },
  async (span) => {
    // Add your logic here
    //
    span.end();
  }
)

Above code will gather the active span of the current request and it will add the **child span inside active span**
And at the end when your logic will completed span.end will close the child span
