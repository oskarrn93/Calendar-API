
//Read environment config variables
import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import {logger} from "./logger.js"

dotenv.config() //read override env file
dotenv.config({ path: 'config.env' }) //read env file

const ENVIRONMENT = process.env.NODE_ENV || "development"
const PORT = process.env.PORT || 8001

const app = express()
app.use(cors())

app.get("/", function(req, res) {
  console.log("/")
  res.send()
})

app.get("/status", function(req, res) {
  console.log("/status")
  res.send({ status: "ok" })
})

app.listen(PORT, function() {
  console.log(`Calendar API server listening on port ${PORT}`)
})

console.log("Hello World!")