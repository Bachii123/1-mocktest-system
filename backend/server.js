const express = require("express");
const cors=require("cors");
const connectDB = require("./config/db");

const app = express();

console.log('Starting server; cwd=', process.cwd());
connectDB();

app.use(cors());
app.use(express.json());

const authRoutes=require("./routes/authRoutes");
const testRoutes=require("./routes/testRoutes");

app.use("/api/auth",authRoutes);
app.use("/api/tests",testRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});