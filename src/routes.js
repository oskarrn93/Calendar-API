import { logger } from './logger.js'
import { getNBA, getCS, getFootball } from './util.js'

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

export const nbaRoute = db => async (req, res, next) => {
  try {
    const result = await getNBA(db)

    res.setHeader('Content-type', 'application/octet-stream')
    res.setHeader('Content-disposition', 'attachment; filename=nba.ics')
    res.send(result.toString().replace(/(?:\r\n)/g, '\n')).end()
  } catch (error) {
    logger.log(error)
    next(error)
  }
}

export const csRoute = db => async (req, res, next) => {
  try {
    const result = await getCS(db)

    res.setHeader('Content-type', 'application/octet-stream')
    res.setHeader('Content-disposition', 'attachment; filename=cs.ics')
    res.send(result.toString().replace(/(?:\r\n)/g, '\n')).end()
  } catch (error) {
    logger.log(error)
    next(error)
  }
}

export const footballRoute = db => async (req, res, next) => {
  try {
    const result = await getFootball(db)

    res.setHeader('Content-type', 'application/octet-stream')
    res.setHeader('Content-disposition', 'attachment; filename=football.ics')
    res.send(result.toString().replace(/(?:\r\n)/g, '\n')).end()
  } catch (error) {
    logger.log(error)
    next(error)
  }
}

export const catchAllRoute = (req, res, next) => {
  // res.status(404)json({ status: 'error' }).end()
  next(new Error('Page not found'))
}
