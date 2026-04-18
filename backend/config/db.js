
const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    await mongoose.connect("mongodb://Harshith:harshith@ac-wkpwvdg-shard-00-00.ug4ujft.mongodb.net:27017,ac-wkpwvdg-shard-00-01.ug4ujft.mongodb.net:27017,ac-wkpwvdg-shard-00-02.ug4ujft.mongodb.net:27017/?ssl=true&replicaSet=atlas-50dq2r-shard-0&authSource=admin&appName=Cluster0");

    console.log("MongoDB Connected");

  } catch (error) {

    console.error("MongoDB connection error:", error);
    process.exit(1);

  }
};

module.exports = connectDB;