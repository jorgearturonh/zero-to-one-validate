import { Server } from "socket.io"
import zeroToOne from "../../controllers/zeroToOne.js"

let io

const createMockResponse = socket => {
  return {
    json: data => {
      socket.emit("validation-result", data)
    },
    status: code => {
      return {
        json: data => {
          socket.emit("validation-result", { status: code, ...data })
        },
      }
    },
  }
}

export const initSocket = server => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", socket => {
    socket.on("validate-idea", async data => {
      try {
        console.log(data)
        const req = {
          body: { ...data },
          headers: { "socket-id": socket.id },
        }
        const res = createMockResponse(socket)

        await zeroToOne(req, res)
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
