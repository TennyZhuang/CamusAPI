/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const LearnHelperUtil = require('../thulib/learnhelper')
const CicLearnHelperUtil = require('../thulib/cic_learnhelper')

const updateCourseInfo = async(user) => {
  const lhu = new LearnHelperUtil(user)
  const cicLhu = new CicLearnHelperUtil(user.username, user.getPassword())
  await lhu.login()
  await cicLhu.login()
  const courses = await lhu.getCourseList()

  const ps = courses.map(course => new Promise(async (resolve) => {
    // TODO: reject
    let notices, documents, assignments
    if (course._courseID.indexOf('-') !== -1) {
      const taskPs = [
        cicLhu.getNotices, cicLhu.getDocuments, cicLhu.getAssignments, cicLhu.getTeacherInfo
      ].map(task => new Promise(async (resolve) => {
        const result = await task.call(cicLhu, course._courseID)
        resolve(result)
      }))

      const results = await Promise.all(taskPs)

      ;[
        notices, documents, assignments, [
          course.teacher, course.email, course.phone
        ]
      ] = results
    } else {
      const taskPs = [
        lhu.getNotices, lhu.getDocuments, lhu.getAssignments
      ].map(task => new Promise(async (resolve) => {
        const result = await task.call(lhu, course)
        resolve(result)
      }))

      const results = await Promise.all(taskPs)
      ;[notices, documents, assignments] = results
    }

    resolve({
      courseName: course.courseName,
      courseID: course.courseID,
      teacher: course.teacher,
      email: course.email,
      phone: course.phone,
      unsubmittedOperations: course.unsubmittedOperations,
      unreadNotice: course.unreadNotice,
      newFile: course.newFile,
      notices: notices,
      documents: documents,
      assignments: assignments
    })
  }))

  user.courses = await Promise.all(ps)
  console.log('update learnhelper info done')

  await user.save()
}

module.exports = updateCourseInfo
