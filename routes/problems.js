const express = require("express");
const router = express.Router();
const { getProblemById, submitSolution } = require("../controllers/problems.controller")
const authentication = require("../middlewares/authentication");

router.get("/:problem_id", authentication, getProblemById);
router.post("/:problem_id", authentication, submitSolution);

module.exports = router;
