const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isLoggedIn = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authorization.replace("Bearer ", "");
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    delete user.password;

    const userWithImages = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
      include: {
        userImages: true,
      },
    });
    req.user = userWithImages;
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(401);
  }
};

module.exports = {
  isLoggedIn,
};
