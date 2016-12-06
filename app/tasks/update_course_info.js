/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const LearnHelperUtil = require('../thulib/learnhelper')

const updateCourseInfo = async(user) => {
  const lhu = new LearnHelperUtil(user.username, user.getPassword())
  await lhu.login()
  await lhu.loginCic()
  const courses = await lhu.getCourseList()

  const courseModels = []
  for (const course of courses) {
    let notices, documents, assignments
    if (course._courseID.indexOf('-') !== -1) {
      notices = await lhu.getCicNotices(course._courseID)
      documents = []
      assignments = []
    } else {
      notices = await lhu.getNotices(course._courseID)
      documents = await lhu.getDocuments(course._courseID)
      assignments = await lhu.getAssignments(course._courseID)
    }

    courseModels.push({
      courseName: course.courseName,
      courseID: course.courseID,
      unsubmittedOperations: course.unsubmittedOperations,
      unreadNotice: course.unreadNotice,
      newFile: course.newFile,
      notices: notices,
      documents: documents,
      assignments: assignments
    })
  }

  user.courses = courseModels
  console.log('update learnhelper info done')

  await user.save()
}

module.exports = updateCourseInfo
