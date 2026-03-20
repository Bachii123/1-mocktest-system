const Result = require("../models/Result");
const Attempt = require("../models/Attempt");
const Question = require("../models/Question");

exports.generateResult = async(req,res)=>{

 try{

  const {attemptId} = req.body;

  const attempt = await Attempt.findById(attemptId);

  const questions = await Question.find({testId:attempt.testId});

  let score = 0;

  attempt.answers.forEach(ans=>{
    const q = questions.find(q=>q._id.toString() === ans.questionId);
    if(q && q.correctAnswer === ans.answer){
      score++;
    }
  });

  let suggestion = "Good attempt. Practice more.";

  if(score < questions.length/2){
    suggestion = "Focus on basics and practice easy questions.";
  }

  const result = new Result({
    studentId:attempt.studentId,
    testId:attempt.testId,
    score:score,
    total:questions.length,
    suggestion:suggestion
  });

  await result.save();

  res.json(result);

 }catch(err){
  res.status(500).json(err.message);
 }

};