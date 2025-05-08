import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export function getRecieverSocketId(userId) {
  return userSocketMap[userId]; // Retrieve the socket ID for the user
}
// used to store online users
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId; // Assuming userId is passed in the query string
  if (userId) {
    userSocketMap[userId] = socket.id; // Store the socket ID for the user
  }

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId]; // Remove the socket ID from the map when the user disconnects
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update the online users list
  });

  // socket.on('message', (message) => {
  //     console.log('message received:', message);
  //     io.emit('message', message); // Broadcast the message to all connected clients
  // });
});

export { io, app, server };
