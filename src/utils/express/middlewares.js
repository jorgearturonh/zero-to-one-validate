import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import { corsOptions } from "../../consts/config.js"

dotenv.config()

const runMiddlewares = app => {
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
}

export default runMiddlewares
