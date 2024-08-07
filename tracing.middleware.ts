import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {
  SpanKind,
  SpanStatusCode,
  trace,
  context,
  propagation,
} from '@opentelemetry/api';
import { AppLogger } from '../utils/logger.service';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tracer = trace.getTracer('your-service-name');

    tracer.startActiveSpan(
      `${req.method} ${req.url}`,
      {
        kind: SpanKind.SERVER,
        attributes: {
          'http.method': req.method,
          'http.url': req.originalUrl,
        },
        root: true,
      },
      (span) => {
        const spanContext = trace.setSpan(context.active(), span);
        const carrier = {};
        propagation.inject(spanContext, carrier);

        res.once('finish', () => {
          span.setStatus({
            code: SpanStatusCode.OK,
            message: `${res.statusCode} ${res.statusMessage}`,
          });

          span.end();
        });

        // Continue with the next middleware or route handler
      },
    );
    next();
  }
}
