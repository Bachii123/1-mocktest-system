const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({

  studentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  testId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Test"
  },

  score:Number,
  total:Number,
  suggestion:String

},{timestamps:true});

module.exports = mongoose.model("Result",ResultSchema);