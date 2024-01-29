const router = require("express").Router();
const { isLoggedIn } = require("../middleware");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = router;

// root route is /api/connections

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    res.send(
      (
        await prisma.friend.findMany({
          where: {
            userID: req.user.id,
          },
          include: {
            friend: {
              include: {
                userImages: true,
              },
            },
          },
        })
      ).map(({ user, friend, ...connection }) => {
        const { password, ...restfriend } = friend;
        return { ...connection, friend: { ...restfriend } };
      })
    );
  } catch (error) {
    next(error);
  }
});

router.post("/", isLoggedIn, async (req, res, next) => {
  const { toUserID } = req.body;
  const { id: fromUserID } = req.user;

  try {
    const connection = await prisma.connection.create({
      data: {
        fromUserID,
        toUserID,
      },
    });

    const otherWayAround = await prisma.connection.findFirst({
      where: {
        fromUserID: toUserID,
        toUserID: fromUserID,
      },
    });

    if (otherWayAround) {
      await prisma.friend.create({
        data: {
          userID: fromUserID,
          friendID: toUserID,
        },
      });

      await prisma.friend.create({
        data: {
          userID: toUserID,
          friendID: fromUserID,
        },
      });

      return res.send({ message: "MUTUAL" });
    }

    res.send({ message: "CREATED" });
  } catch (error) {
    next(error);
  }
});
