const express = require("express");
const router = express.Router();

const errorHandling = require("../middlewares/errors/errorHandling");
const Problem = require("../models/Problem");
const authentication = require("../middlewares/authentication");
const ERRORS = require("../controllers/messages");

router.get("/", authentication, async (req, res, next) => {
  try {
    const problems = await Problem.find().lean();

    if (!problems) {
      throw new errorHandling(ERRORS.PROBLEM.NOT_FOUND, 404);
    }

    res.render("index", { problems });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
