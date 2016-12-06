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
    const notices = await lhu.getNotices(course.courseID)
    const documents = await lhu.getDocuments(course.courseID)
    const assignments = await lhu.getAssignments(course.courseID)

    user.courses.push({
      courseName: course.courseName,
      courseID: course.courseID,
      courseNS: course.courseNS,
      unsubmittedOperations: course.unsubmittedOperations,
      unreadNotice: course.unreadNotice,
      newFile: course.newFile,
      notices: notices,
      documents: documents,
      assignments: assignments
    })
  }

  await user.save()
}

module.exports = updateCourseInfo
