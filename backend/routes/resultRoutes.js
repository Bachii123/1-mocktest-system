const express = require("express");
const router = express.Router();

const {generateResult} = require("../controllers/resultController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/generate", authMiddleware, generateResult);

module.exports = router;