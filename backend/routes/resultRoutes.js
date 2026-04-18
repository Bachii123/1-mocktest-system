const express = require("express");
const router = express.Router();

const { generateResult, getTestAnalysis } = require("../controllers/resultController");
const authMiddleware = require("../middleware/authMiddleware");

// EXISTING → GENERATE RESULT (UNCHANGED)
router.post("/generate", authMiddleware, generateResult);

//  NEW → GET TEST ANALYSIS
router.get("/analysis/:testId", authMiddleware, getTestAnalysis);

module.exports = router;