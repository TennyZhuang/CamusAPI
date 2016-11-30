/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const LearnHelperUtil = require('../thulib/learnhelper')
const Course = require('../models/course').Course

const updateCourseInfo = async(user) => {
  const lhu = new LearnHelperUtil(user.username, user.password)
  await lhu.login()
  const courses = await lhu.getCourseList()
  const _courses = []
  courses.forEach((course, i) => {
    _courses[i] = new Course({
      courseName: course['coursename'],
      courseID: course['courseid'],
      unsubmittedOperations: course['unsubmittedoperations'],
      unreadNotice: course['unreadnotice'],
      newFile: course['newfile'],
      notices: [],
      documents: [],
      assignments: []
    })
  })
  user.courses = _courses
  user.save()
}

module.exports = updateCourseInfo
