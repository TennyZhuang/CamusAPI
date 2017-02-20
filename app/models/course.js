/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const mongoose = require('mongoose')
const uuid = require('uuid')

const NoticeSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true
  },
  noticeID: {
    type: String,
    index: true
  },
  title: String,
  publisher: String,
  publishTime: Number,
  state: String,
  content: String
}, {
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
      delete ret.__v
    }
  }
})

const DocumentSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    index: true
  },
  explanation: String,
  updatingTime: Number,
  state: String,
  size: String,
  url: String
}, {
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
      delete ret.__v
    }
  }
})

const AssignmentSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true
  },
  assignmentID: {
    type: String,
    index: true
  },
  title: {
    type: String,
    index: true
  },
  detail: String,
  startDate: Number,
  dueDate: Number,
  state: String,
  size: String,
  evaluatingTeacher: String,
  evaluatingDate: Number,
  comment: String,
  grade: Number,
  filename: String,
  fileURL: String,
  scored: Boolean
}, {
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
      delete ret.__v
    }
  }
})

const CourseSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true
  },
  courseName: {
    type: String,
    index: true
  },
  courseID: {
    type: String,
    index: true
  },
  _courseID: String,
  unsubmittedOperations: Number,
  unreadNotice: Number,
  newFile: Number,
  teacher: String,
  phone: String,
  email: String,
  notices: [{
    type: String,
    ref: 'Notice'
  }],
  documents: [{
    type: String,
    ref: 'Document'
  }],
  assignments: [{
    type: String,
    ref: 'Assignment'
  }]
}, {
  toObject: {
    transform: (doc, ret) => {
      for (const [k, v] of Object.entries(ret)) {
        if (Array.isArray(v)) {
          delete ret[k]
        }
      }

      delete ret._id
      delete ret._courseID
      delete ret.__v
    }
  }
})

NoticeSchema.pre('save', function (next) {
  if (this.isNew) {
    this._id = `${this.noticeID}_${uuid.v4()}`
  }

  next()
})

DocumentSchema.pre('save', function (next) {
  if (this.isNew) {
    this._id = `document_${uuid.v4()}`
  }

  next()
})

AssignmentSchema.pre('save', function (next) {
  if (this.isNew) {
    this._id = `${this.assignmentID}_${uuid.v4()}`
  }

  next()
})

CourseSchema.pre('save', function (next) {
  if (this.isNew) {
    this._id = `${this.courseID}_${uuid.v4()}`
  }

  next()
})


const Notice = mongoose.model('Notice', NoticeSchema)
const Document = mongoose.model('Document', DocumentSchema)
const Assignment = mongoose.model('Assignment', AssignmentSchema)
const Course = mongoose.model('Course', CourseSchema)

module.exports = {
  Notice,
  Document,
  Assignment,
  Course,
  CourseSchema
}
