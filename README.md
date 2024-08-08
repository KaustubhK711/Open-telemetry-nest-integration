# Open-telemetry-nest-integration
Open Telemetry Integration in Nest or Node


# Configuration to start exporting the traces for your application

Add import below statement

`import { startTracing } from './tracing';`

Add below method call inside boostrap() or start function of your app

`startTracing();`

Import below statement in your all controller files where you want traces

`import { TraceMethod } from '../../../decorators/tracing.decorator';`

Add below custom decorator above all the APIs that you wanted to trace

`@TraceMethod()`

Add below import statement inside your app.module file

`import { TracingMiddleware } from './middlewares/tracing.middleware';`

Configure the tracing middleware inside your app.module file by calling below class

`TracingMiddleware`

# Trace lifecycle of request in one root span and multiple child spans

To trace a request end-to-end in one span and create child spans for the respective services/workers called by the request, add the following code inside your services and workers:

Import the below statement inside your services from where you want traces

`import { SpanKind, trace } from '@opentelemetry/api';`

Add below (snippet.ts) code inside your service's/worker's methods wherever you want to trace into child spans

https://github.com/KaustubhK711/Open-telemetry-nest-integration/blob/63d69865301cdaaa3b2ba26c8238be6ace492a50/snippet.ts

The code from snippet.ts will retrieve the active span of the current request and add a child span within it. 
When your logic is completed, the span.end() method will close the child span.
