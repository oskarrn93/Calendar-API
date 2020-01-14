import dotenv from 'dotenv'
import express from 'express'

import Sentry from '@sentry/node'
import { default as mongodb } from 'mongodb'
import { logger } from './logger.js'
import {
  initExpressMiddleware,
  initExpressErrorMiddleWare,
  initExpressRoutes,
} from './middleware.js'

dotenv.config() //read .env file (if it exists)
dotenv.config({ path: 'config.env' })

//const ENVIRONMENT = process.env.NODE_ENV || "development"
const PORT = process.env.PORT || 8001

const db = {
  dbName: process.env.MONGODB_DBNAME,
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

initExpressMiddleware(app)
initExpressRoutes(app, db)
initExpressErrorMiddleWare(app)
