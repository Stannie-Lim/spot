const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { isLoggedIn } = require("../middleware");

const prisma = new PrismaClient();

module.exports = router;

// root route is /api/auth

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      return res.status(409).send({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const image = await prisma.userImage.create({
      data: {
        imageURL:
          "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png",
        userID: newUser.id,
        index: 0,
      },
    });

    const token = jwt.sign(newUser, process.env.JWT_SECRET_KEY);

    res.send(token);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(409).send({ message: "User does not exist" });
    }

    const isCorrectPassword = bcrypt.compareSync(password, user.password);

    // successfully logged in!
    if (isCorrectPassword) {
      const token = jwt.sign(user, process.env.JWT_SECRET_KEY);

      res.send(token);
    } else {
      res.status(401).send({ message: "Incorrect password" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/me", isLoggedIn, async (req, res, next) => {
  res.send(req.user);
});
