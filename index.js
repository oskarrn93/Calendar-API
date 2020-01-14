import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import Sentry from '@sentry/node'
import { default as mongodb } from 'mongodb'
import { logger } from './logger.js'
import {
  statusRoute,
  rootRoute,
  sentryDebugRoute,
  testRoute,
  nbaRoute,
  catchAllRoute,
} from './routes.js'

dotenv.config() //read .env file (if it exists)
dotenv.config({ path: 'config.env' })

//const ENVIRONMENT = process.env.NODE_ENV || "development"
const PORT = process.env.PORT || 8001

const db = {
  dbName: 'calendar-api',
  handler: null,
  url: process.env.MONGODB_URL,
}

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN })
} else {
  console.log('No Sentry DSN configured')
}

const mongoclient = new mongodb.MongoClient(db.url, {
  native_parser: true,
  useUnifiedTopology: true,
})

/**
 * Express Listen
 */

mongoclient.connect(async err => {
  if (err) throw err

  db.handler = mongoclient.db(db.dbName)

  app.listen(PORT, function() {
    logger.log(`Calendar API server listening on port ${PORT}`)
  })
})

const app = express()
//app.set('json replacer', replacer) // property transformation rules
app.set('json spaces', 2) // number of spaces for indentation

/**
 * Express Middleware
 */

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

/**
 * Express Routes
 */

app.get('/', rootRoute)
app.use('/status', statusRoute)
app.get('/sentry-debug', sentryDebugRoute)
app.get('/test', testRoute(db))
app.get('/nba', nbaRoute(db))
app.get('*', catchAllRoute)

/**
 * Express Error Handling Middleware
 */

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
