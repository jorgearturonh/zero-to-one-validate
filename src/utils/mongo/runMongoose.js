import dotenv from "dotenv"
import mongoose from "mongoose"
import { mongoOptions } from "../../consts/config.js"
import runRoutes from "../../routes/runRoutes.js"

dotenv.config()

const EXPRESS_PORT = process.env.PORT || 3001

const runMongoose = app => {
  mongoose
    .connect(process.env.MONGO_URI, mongoOptions)
    .then(async () => {
      console.log("Connected to MongoDB")

      runRoutes(app)
      app.listen(EXPRESS_PORT, () => {
        console.log(`Server started on port ${EXPRESS_PORT}`)
      })
    })
    .catch(err => {
      console.error("Error connecting to database", err)
      process.exit(1)
    })
}

export default runMongoose
