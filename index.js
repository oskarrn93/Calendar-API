
//Read environment config variables
require('dotenv').config()
require('dotenv').config({ path: 'config.env' })

const express = require("express")
const cors = require("cors")
const app = express()

const PORT = process.env.PORT || 8001


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