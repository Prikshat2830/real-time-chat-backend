import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"

import userRoutes from "./routes/UserRoutes.js"
import chatRoutes from "./routes/ChatRoutes.js"
import messageRoutes from "./routes/MessageRoutes.js"

import { createServer } from "http"
import { Server } from "socket.io"
import socketHandler from "./socket/socket.js"

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)

const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})

socketHandler(io)

server.listen(process.env.PORT || 5000, () => {
    console.log("Server Is Running");
    
} )