tracer.startActiveSpan(
  `${this.constructor.name}.your-method-name`,
  { kind: SpanKind.SERVER },
  async (span) => {
    // Add your logic here
    //
    span.end();
  }
)
