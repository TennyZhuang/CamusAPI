/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const User = require('../models/user')

const getCourseList = async(username) => {
  const user = await User.findOne({username: username})
  return user.courses
}

const getCourse = async (username, courseID) => {
  const user = await User.findOne({username}).populate('courses')
  const course = user.courses.find(c => c.courseID === courseID)
  return course
}

exports.getCourseList = getCourseList
exports.getCourse = getCourse
