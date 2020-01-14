import express from 'express'
import { logger } from './logger.js'

const router = express.Router()

export const rootRoute = (req, res) => {
  res
    .status(200)
    .send('Hello world!')
    .end()
}

export const statusRoute = (req, res) => {
  res
    .status(200)
    .json({ status: 'ok' })
    .end()
}

export const sentryDebugRoute = (req, res, next) => {
  try {
    throw new Error('test error')
  } catch (error) {
    logger.log('catched test error, calling next')
    next(error)
  }
}

export const testRoute = db => async (req, res, next) => {
  const collection = db.handler.collection('test')
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
}

export const collectionRoute = (db, collectionName) => async (req, res, next) => {
  const collection = db.handler.collection(collectionName)
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
}

export const catchAllRoute = (req, res, next) => {
  // res.status(404)json({ status: 'error' }).end()
  next(new Error('Page not found'))
}
