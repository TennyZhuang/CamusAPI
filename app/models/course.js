/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const mongoose = require('mongoose')

const NoticeSchema = new mongoose.Schema({
  sequenceNum: {
    type: Number,
    index: true
  },
  title: String,
  publishTime: String,
  state: String,
  content: String
})

const DocumentSchema = new mongoose.Schema({
  sequenceNum: {
    type: Number,
    index: true
  },
  title: {
    type: String,
    index: true
  },
  explanation: String,
  updatingTime: String,
  state: String,
  size: String,
  url: String
})

const AssignmentSchema = new mongoose.Schema({
  sequenceNum: {
    type: Number,
    index: true
  },
  title: {
    type: String,
    index: true
  },
  detail: String,
  startDate: String,
  dueDate: String,
  evaluatingTeacher: String,
  evaluatingDate: String,
  comment: String,
  grade: Number
})

const CourseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    index: true
  },
  courseID: {
    type: String,
    index: true
  },
  unsubmittedOperations: Number,
  unreadNotice: Number,
  newFile: Number,
  notices: [NoticeSchema],
  documents: [DocumentSchema],
  assignments: [AssignmentSchema]
}, {
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
    }
  }
})

const Course = mongoose.model('Course', CourseSchema)

module.exports.Course = Course
module.exports.CourseSchema = CourseSchema
