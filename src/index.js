
/**
 * Imports
 */

import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import {logger} from "./logger.js"

/**
 * Config
 */

dotenv.config() //read override env file
dotenv.config({ path: 'config.env' }) //read env file

/**
 * Setup
 * 
 */
const ENVIRONMENT = process.env.NODE_ENV || "development"
const PORT = process.env.PORT || 8001

/**
 * Express
 * 
 */
const app = express()
//app.set('json replacer', replacer); // property transformation rules
app.set('json spaces', 2); // number of spaces for indentation

/**
 * Express Middleware
 */

app.use(cors())


//log incoming requests
app.use(function (req, res, next) {
  logger.log(`route: ${req.url}`)
  next()
})

/**
 * Express Routes
 */

app.get("/", (req, res) => {
  res.status(200);
  res.json({ status: "ok" })
  res.end()
})

app.get("/status", (req, res) => {
  res.status(200);
  res.json({ status: "ok" })
  res.end()
})


app.get("/test/error", (req, res, next) => {

  try {
    let error = new Error("test error")
    error.statusCode = 418;
    throw error;

    res.status(200);
    res.json({ status: "ok" })
    res.end()

  } catch(error) {
    logger.log("catched test error, calling next")
    next(error)
  }

})

app.get('*', (req, res) => {
  res.status(404);
  res.json({ status: "error" })
  res.end()
});

/**
 * Express Error Handling Middleware
 */

//log error
app.use(function (err, req, res, next) {
  logger.log("log error")
  logger.error(err.stack)
  next(err)
})

//handle error
app.use(function (err, req, res, next) {
  logger.log("handle error")
  
  //if no error status code is set, default to 500
  if (!err.statusCode) err.statusCode = 500; 

  res.status(err.statusCode)

  res.json({ 
    status: "error",
    message: err.message  
  })

  res.end()
})

/**
 * Express Listen
 */

app.listen(PORT, function() {
  logger.log(`Calendar API server listening on port ${PORT}`)
})
