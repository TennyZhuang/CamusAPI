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
})

const CurriculumSchema = new mongoose.Schema({
  curriculum: [CurriculumClassSchema]
})
const Curriculum = mongoose.model('Curriculum', CurriculumSchema)

module.exports.Curriculum = Curriculum

