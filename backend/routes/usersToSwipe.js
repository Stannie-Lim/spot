const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { isLoggedIn } = require("../middleware");

const prisma = new PrismaClient();

module.exports = router;

// root route is /api/users_to_swipe
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const usersToSwipe = await prisma.users.findMany({
      take: 25,
      where: {
        id: { not: req.user.id },
      },
      include: {
        userImages: true,
      },
    });

    let valentines = [];

    const haventPushed = [];
    for (const user of usersToSwipe) {
      const { username } = user;
      if (username === "will") valentines[0] = user;
      else if (username === "you") valentines[1] = user;
      else if (username === "be") valentines[2] = user;
      else if (username === "my") valentines[3] = user;
      else if (username === "valentine") valentines[4] = user;
      else {
        haventPushed.push(user);
      }
    }

    valentines = [...haventPushed, ...valentines];

    const removedPasswords = valentines.map(({ password, ...user }) => ({
      ...user,
    }));

    const friends = await prisma.friend.findMany({
      where: {
        userID: req.user.id,
      },
    });

    const removedPasswordsAndFriends = removedPasswords.filter((user) => {
      return friends.find((friend) => friend.friendID === user.id) == null;
    });

    res.send(removedPasswordsAndFriends);
  } catch (error) {
    next(error);
  }
});
