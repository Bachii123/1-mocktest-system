const express = require("express");
const router = express.Router();

const { createTest, getTests } = require("../controllers/testController");

const authMiddleware = require("../middleware/authMiddleware");


// Faculty creates test

router.post("/",createTest);


// Students fetch tests

router.get("/", getTests);


module.exports = router;