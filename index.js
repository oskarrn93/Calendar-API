import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import Sentry from '@sentry/node'
import { default as mongodb } from 'mongodb'

import { logger } from './logger.js'

dotenv.config() //read .env
dotenv.config({ path: 'config.env' })

//const ENVIRONMENT = process.env.NODE_ENV || "development"
const PORT = process.env.PORT || 8001
const SENTRY_DSN = process.env.SENTRY_DSN //SENTRY_DSN is defined in dotenv file

const MONGODB_URL =
  process.env.MONGODB_URL ||
  `mongodb://process.env.${MONGODB_USERNAME}:${MONGODB_PASSWORD}localhost:27017/`
const MONGODB_DBNAME = 'calendar-api'

var db = null

if (SENTRY_DSN) {
  Sentry.init({ dsn: SENTRY_DSN })
} else {
  console.log('No Sentry DSN configured')
}

const mongoclient = new mongodb.MongoClient(MONGODB_URL, {
  native_parser: true,
  useUnifiedTopology: true,
})

/**
 * Express Listen
 */

mongoclient.connect(async err => {
  if (err) throw err

  db = mongoclient.db(MONGODB_DBNAME)

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
if (SENTRY_DSN) {
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

app.get('/', (req, res) => {
  res.status(200)
  res.json({ status: 'ok' })
  res.end()
})

app.get('/status', (req, res) => {
  res.status(200)
  res.json({ status: 'ok' })
  res.end()
})

app.get('/sentry-debug', (req, res, next) => {
  try {
    throw new Error('test error')
  } catch (error) {
    logger.log('catched test error, calling next')
    next(error)
  }
})

app.get('/test', async (req, res, next) => {
  const collection = db.collection('test')
  try {
    const result = await collection.find({}).toArray()

    res
      .status(200)
      .json(result)
      .end()
  } catch (error) {
    logger.log(error)
    next(error)
  }
})

app.get('*', (req, res) => {
  res.status(404)
  res.json({ status: 'error' })
  res.end()
})

/**
 * Express Error Handling Middleware
 */

// The error handler must be before any other error middleware
if (SENTRY_DSN) {
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
