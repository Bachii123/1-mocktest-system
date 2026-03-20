const express = require("express");
const router = express.Router();

const {submitAttempt} = require("../controllers/attemptController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/submit",authMiddleware,submitAttempt);

module.exports = router;