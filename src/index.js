import dotenv from "dotenv"
import express from "express"
import runMiddlewares from "./utils/express/middlewares.js"
import runMongoose from "./utils/mongo/runMongoose.js"

dotenv.config()
const app = express()
console.clear()

runMiddlewares(app)
runMongoose(app)
