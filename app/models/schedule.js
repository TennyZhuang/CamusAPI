/**
 * Created by XiYe on 12/23/2016.
 */

const mongoose = require('mongoose')

const ScheduleSchema = new mongoose.Schema({
  place: {
    type: String
  },
  type: {
    type: String
  },
  startTime: {
    type: String
  },
  dueTime: {
    type: String
  },
  date: {
    type: String
  },
  content: {
    type: String
  },
  description: {
    type: String
  }
})

const ScheduleSchema = mongoose.model('ScheduleSchema', ScheduleSchema)

module.exports.ScheduleSchema = ScheduleSchema
module.exports.ScheduleSchema = ScheduleSchema
