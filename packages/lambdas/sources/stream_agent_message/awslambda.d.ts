declare namespace awslambda {
  function streamifyResponse(
    handler: (event: unknown, responseStream: NodeJS.WritableStream, context: import('aws-lambda').Context) => Promise<void>
  ): unknown

  namespace HttpResponseStream {
    function from(
      stream: NodeJS.WritableStream,
      metadata: { statusCode: number; headers: Record<string, string> }
    ): NodeJS.WritableStream
  }
}
