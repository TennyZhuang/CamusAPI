/**
 * Created by Songzhou Yang on 12/11/2016.
 */

const mongoose = require('mongoose')

const InfoSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true
  },
  id: String,
  beginTime: Number,
  endTime: Number
}, {
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
    }
  }
})

const TeachingInfoSchema = new mongoose.Schema({
  time: {
    type: Number,
    index: true
  },
  currentSemester: InfoSchema,
  currentTeachingWeek: InfoSchema,
  nextSemester: InfoSchema
}, {
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
    }
  }
})

const TeachingInfo = mongoose.model('TeachingInfo', TeachingInfoSchema)

module.exports = TeachingInfo
