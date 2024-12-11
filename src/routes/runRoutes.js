import gptRoutes from "./index.js"

function runRoutes(app) {
  app.use("/", gptRoutes)
}

export default runRoutes
