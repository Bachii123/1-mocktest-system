const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

console.log("Starting server; cwd=", process.cwd());
connectDB();

app.use(cors());
app.use(express.json());

// ROUTES
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const resultRoutes = require("./routes/resultRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/results", resultRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});