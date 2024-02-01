const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = router;

router.get("/", async (req, res, next) => {
  const { search } = req.query;

  try {
    const results = await prisma.tag.findMany({
      where: {
        name: {
          startsWith: search,
          mode: "insensitive",
        },
      },
    });

    res.send(results);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;

    const result = await prisma.tag.create({
      data: {
        name,
      },
    });

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
});
