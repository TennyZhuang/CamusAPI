/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const LearnHelperUtil = require('../thulib/learnhelper')

const updateCourseInfo = async(user) => {
  const lhu = new LearnHelperUtil(user.username, user.getPassword())
  await lhu.login()
  const courses = await lhu.getCourseList()

  user.courses = []
  for (const course of courses) {
    const notices = await lhu.getNotices(course.courseid)
    const documents = await lhu.getDocuments(course.courseid)
    const assignments = await lhu.getAssignments(course.courseid)

    user.courses.push({
      courseName: course.coursename,
      courseID: course.courseid,
      unsubmittedOperations: course.unsubmittedoperations,
      unreadNotice: course.unreadnotice,
      newFile: course.newfile,
      notices: notices,
      documents: documents,
      assignments: assignments
    })
  }

  await user.save()
}

module.exports = updateCourseInfo
