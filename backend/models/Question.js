const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  testId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Test",
    required:true
  },
  questionText:{
    type:String,
    required:true
  },
  options:[String],

  correctAnswer:{
    type:String,
    required:true
  },

  difficulty:{
    type:String,
    enum:["Easy","Medium","Hard"],
    default: "medium",
    required:true
  }

},{timestamps:true});

module.exports = mongoose.model("Question",QuestionSchema);