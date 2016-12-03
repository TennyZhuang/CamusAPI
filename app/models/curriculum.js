/**
 * Created by XiYe on 12/1/2016.
 */

const mongoose = require('mongoose')

const CurriculumClassSchema = new mongoose.Schema({
  courseID: {
    type: String,
    index: true
  },
  courseName: {
    type: String,
    index: true
  },
  courseSequence: {
    type: Number
  },
  teacher: {
    type: String
  },
  classroom: {
    type: String
  },
  time: {
    type: [Number]
  },
  week: {
    type: [Number]
  }
}, {
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
    }
  }
})

const CurriculumClass = mongoose.model('CurriculumClass', CurriculumClassSchema)

module.exports.CurriculumClass = CurriculumClass
module.exports.CurriculumClassSchema = CurriculumClassSchema

