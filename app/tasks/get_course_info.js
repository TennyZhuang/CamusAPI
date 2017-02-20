/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const Course = require('../models/course').Course

const getCourse = async(user, courseID) => {
  const courseObjID = user.courses.find(c => c.startsWith(courseID))
  const course = await Course.findById(courseObjID)
  return course
}

exports.getCourse = getCourse
