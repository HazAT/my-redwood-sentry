const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api')
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const {
  FastifyInstrumentation,
} = require('@opentelemetry/instrumentation-fastify')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { Resource } = require('@opentelemetry/resources')
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions')
const { PrismaInstrumentation } = require('@prisma/instrumentation')
const {
  SentrySpanProcessor,
  SentryPropagator,
} = require('@sentry/opentelemetry-node')
// You may wish to set this to DiagLogLevel.DEBUG when you need to debug opentelemetry itself
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO)

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'redwood-app',
    [SemanticResourceAttributes.SERVICE_VERSION]: '0.0.0',
  })
)

const provider = new NodeTracerProvider({
  resource: resource,
})

provider.addSpanProcessor(new SentrySpanProcessor())

// Initialize the provider
provider.register({
  propagator: new SentryPropagator(),
})

// Optionally register instrumentation libraries here
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    new HttpInstrumentation(),
    new FastifyInstrumentation(),
    new PrismaInstrumentation({
      middleware: true,
    }),
  ],
})

provider.register()
