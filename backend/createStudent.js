const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createStudent() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mocktest');
    const hashedPassword = await bcrypt.hash('student123', 10);
    const user = new User({
      name: 'Test Student',
      email: 'student@example.com',
      password: hashedPassword,
      role: 'student'
    });
    await user.save();
    console.log('Student account created: email=student@example.com, password=student123');
  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    process.exit();
  }
}

createStudent();