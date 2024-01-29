const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authorization.replace("Bearer ", "");
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

module.exports = {
  isLoggedIn,
};
