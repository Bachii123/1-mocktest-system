const express = require("express");
const router = express.Router();

const {
  createTest,
  getTests,
  getFacultyTests,
  deleteTest
} = require("../controllers/testController");

const authMiddleware = require("../middleware/authMiddleware");

// Faculty creates test
router.post("/", authMiddleware, createTest);

// Students fetch tests
router.get("/", authMiddleware, getTests);

// Get tests created by a faculty
router.get("/faculty/:facultyId", authMiddleware, getFacultyTests);

// Delete a test
router.delete("/:testId", authMiddleware, deleteTest);

module.exports = router;