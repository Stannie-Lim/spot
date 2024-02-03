const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const seed = async () => {
  try {
    await prisma.message.deleteMany({});
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

    const images = [
      {
        name: "will",
        image:
          "https://logos.flamingtext.com/Word-Logos/will-design-sketch-name.png",
      },
      {
        name: "you",
        image: "https://i.ytimg.com/vi/oNgtsARDrpY/maxresdefault.jpg",
      },
      { name: "be", image: "https://i.ytimg.com/vi/XiChA1YCx2k/sddefault.jpg" },
      {
        name: "my",
        image:
          "https://logos.flamingtext.com/Word-Logos/my-design-sketch-name.png",
      },
      {
        name: "valentine",
        image:
          "https://cdn1.vectorstock.com/i/1000x1000/05/20/valentine-word-text-typography-design-logo-icon-vector-21490520.jpg",
      },
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

    images.forEach(async ({ name, image }) => {
      const user = await prisma.users.create({
        data: {
          username: name,
          password: bcrypt.hashSync(name, 10),
        },
      });

      await prisma.userImage.create({
        data: {
          index: 0,
          imageURL: image,
          userID: user.id,
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};

seed();
