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

const putMessageInDB = async (data) => {
  const { sender, message, createdAt } = data;
  const receiver = data.receiver.friend;

  try {
    await prisma.message.create({
      data: {
        fromUser: {
          connect: {
            id: sender.id,
          },
        },
        toUser: {
          connect: {
            id: receiver.id,
          },
        },
        msg: message,
        sentAt: createdAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getMessagesFromAtoB = async (senderID, receiverID) => {
  return prisma.message.findMany({
    where: {
      fromUser: {
        id: senderID,
      },
      toUser: {
        id: receiverID,
      },
    },
    include: {
      fromUser: {
        include: {
          userImages: true,
        },
      },
      toUser: {
        include: {
          userImages: true,
        },
      },
    },
  });
};

const getMessagesBetweenUsers = async (senderID, receiverID) => {
  const aToB = await getMessagesFromAtoB(senderID, receiverID);
  const bToA = await getMessagesFromAtoB(receiverID, senderID);

  return aToB.concat(bToA).sort((a, b) => b.sentAt - a.sentAt);
};

io.on("connection", (socket) => {
  socket.on("join_room", async ({ senderID, receiverID }) => {
    socket.join(senderID);
    chats[senderID] = socket;

    const messages = await getMessagesBetweenUsers(senderID, receiverID);

    socket.emit("all_messages", messages);
  });

  socket.on("message", async (data) => {
    const socket = chats[data.receiver.friend.id];

    await putMessageInDB(data);

    if (socket) {
      socket.emit("message", data);
    }
  });

  socket.on("disconnect", () => {
    delete chats[socket.id];
  });
});
