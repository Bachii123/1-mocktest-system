const Attempt = require("../models/Attempt");

exports.submitAttempt = async(req,res)=>{

  try{

    const {testId,answers,notes,difficultyMarks} = req.body;

    const attempt = new Attempt({
      studentId,
      testId,
      answers,
      notes,
      difficultyMarks
    });

    await attempt.save();

    res.json({
      message:"Test submitted successfully",
      attempt
    });

  }catch(err){
    res.status(500).json(err.message);
  }

};