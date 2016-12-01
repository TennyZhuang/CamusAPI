/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const LearnHelperUtil = require('../thulib/learnhelper')

const updateCourseInfo = async(user) => {
  const lhu = new LearnHelperUtil(user.username, user.password)
  await lhu.login()
  const courses = await lhu.getCourseList()

  user.courses = []
  for (const course of courses) {
    const notices = await lhu.getNotices(course.courseid)

    user.courses.push({
      courseName: course['coursename'],
      courseID: course['courseid'],
      unsubmittedOperations: course['unsubmittedoperations'],
      unreadNotice: course['unreadnotice'],
      newFile: course['newfile'],
      notices: notices,
      documents: [],
      assignments: []
    })
  }

  await user.save()
}

module.exports = updateCourseInfo
