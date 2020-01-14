import Sentry from '@sentry/node'
import cors from 'cors'
import { logger } from './logger.js'
import {
  statusRoute,
  rootRoute,
  sentryDebugRoute,
  testRoute,
  nbaRoute,
  catchAllRoute,
} from './routes.js'

/**
 * Express Middleware
 */

export const initExpressMiddleware = app => {
  // The request handler must be the first middleware on the app
  if (process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.requestHandler())
  }

  app.use(cors())

  //log incoming requests
  app.use(function(req, res, next) {
    logger.log(`route: ${req.url}`)
    next()
  })
}

/**
 * Express Routes
 */

export const initExpressRoutes = (app, db) => {
  app.get('/', rootRoute)
  app.use('/status', statusRoute)
  app.get('/sentry-debug', sentryDebugRoute)
  app.get('/test', testRoute(db))
  app.get('/nba', nbaRoute(db))
  app.get('*', catchAllRoute)
}

/**
 * Express Error Handling Middleware
 */

export const initExpressErrorMiddleWare = app => {
  // The error handler must be before any other error middleware
  if (process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.errorHandler())
  }

  //log error
  app.use(function(err, req, res, next) {
    logger.log('log error')
    logger.error(err.stack)
    next(err)
  })

  //handle error
  app.use(function(err, req, res, next) {
    logger.log('handle error')

    if (!err.statusCode) err.statusCode = 500

    res.status(err.statusCode)

    const result = {
      status: 'error',
      message: err.message,
      sentry: '',
    }

    if (res.sentry) {
      result.sentry = res.sentry
    }

    res.json(result)

    res.end()
  })
}
