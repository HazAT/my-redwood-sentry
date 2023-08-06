import { useSentry } from '@envelop/sentry'

import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

import 'src/lib/sentry'

export const handler = createGraphQLHandler({
  extraPlugins: [
    useSentry({
      includeRawResult: true,
      includeResolverArgs: true,
      includeExecuteVariables: true,
    }),
  ],
  loggerConfig: { logger, options: {} },
  directives,
  sdls,
  services,
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
