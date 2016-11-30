const mongoose = require('mongoose')

const POSITIONS = ['undergraduate', 'master', 'doctor', 'teacher', 'unknown']

const userInfoSchema = new mongoose.Schema({
  studentNumber: String,
  department: String,
  realName: String,
  email: String,
  position: {
    type: String,
    enum: POSITIONS
  }
}, {
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
    }
  }
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: String,
  info: userInfoSchema
})

const User = mongoose.model('User', userSchema)

module.exports = User
