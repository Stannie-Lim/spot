const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const seed = async () => {
  try {
    await prisma.userImage.deleteMany({});
    await prisma.connection.deleteMany({});
    await prisma.friend.deleteMany({});
    await prisma.users.deleteMany({});

    const imagesForUser1 = [
      { index: 0, imageURL: "https://i.imgur.com/TKv4Uzs.jpeg" },
    ];
    const imagesForUser2 = [
      { index: 0, imageURL: "https://i.imgur.com/MmO41PM.jpeg" },
    ];

    const user1 = await prisma.users.create({
      data: {
        username: "stanni",
        password: bcrypt.hashSync("stanni", 10),
      },
    });

    const user2 = await prisma.users.create({
      data: {
        username: "marci",
        password: bcrypt.hashSync("marci", 10),
      },
    });

    imagesForUser1.forEach(async (image) => {
      await prisma.userImage.create({
        data: {
          ...image,
          userID: user1.id,
        },
      });
    });

    imagesForUser2.forEach(async (image) => {
      await prisma.userImage.create({
        data: {
          ...image,
          userID: user2.id,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

seed();
