const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

dotenv.config();

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/connections", require("./routes/connections"));
app.use("/api/users_to_swipe", require("./routes/usersToSwipe"));

const server = app.listen(3000);

const io = new Server(server, {
  cors: {
    origin: "exp://192.168.1.113:8081",
  },
});

const chats = {};

io.on("connection", (socket) => {
  socket.on("join_room", (userID) => {
    socket.join(userID);
    chats[userID] = socket;
  });

  socket.on("message", (data) => {
    const socket = chats[data.receiver.friend.id];

    socket.emit("message", data);
  });
});
