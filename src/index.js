
//Read environment config variables
import dotenv from "dotenv"
import express from "express"
import cors from "cors"


dotenv.config() //read first custom env file for allowing overrides
dotenv.config({ path: 'config.env' }) //then read standard env


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