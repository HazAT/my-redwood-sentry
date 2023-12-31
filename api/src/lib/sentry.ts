import * as Sentry from '@sentry/node-experimental'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Prisma(),
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  tracesSampleRate: 1.0,
})

export default Sentry
