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
    const removedPasswords = usersToSwipe.map(({ password, ...user }) => ({
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
