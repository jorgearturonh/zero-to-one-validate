import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import { corsOptions } from "../../consts/config.js"

dotenv.config()

const runMiddlewares = app => {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      dnsPrefetchControl: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
    })
  )
  app.use(helmet.noSniff())
  app.use(helmet.xssFilter())
  app.use(helmet.hidePoweredBy())
  app.use(helmet.frameguard({ action: "deny" }))

  // Content Security Policy
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // For Socket.IO
        connectSrc: ["'self'", "wss:", "ws:"], // For WebSocket connections
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        upgradeInsecureRequests: [],
      },
    })
  )

  // Existing middleware
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
}

export default runMiddlewares
