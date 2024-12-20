import { Server } from "socket.io"
import searchSocketController from "../../controllers/searchSocketController.js"

let io

export const initSocket = server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      methods: ["GET", "POST"],
      pingTimeout: 60000,
      pingInterval: 25000,
      connectTimeout: 5000,
      maxHttpBufferSize: 1e6, // 1MB
      transports: ["websocket"],
      allowEIO3: false,
    },
  })

  io.on("connection", socket => {
    socket.on("validate-idea", async data => {
      try {
        const req = {
          body: { ...data },
          headers: { "socket-id": socket.id },
        }

        await searchSocketController(req)
      } catch (error) {
        socket.emit("validation-error", { error: error.message })
      }
    })
  })

  return io
}

export const emitUpdate = (room, data, event = "analysisUpdate") => {
  if (!io) return
  io.to(room).emit(event, data)
}

export const joinRoom = (socketId, room) => {
  if (!io) return
  const socket = io.sockets.sockets.get(socketId)
  if (socket) {
    socket.join(room)
  }
}
