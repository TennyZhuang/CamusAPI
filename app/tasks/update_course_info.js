/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const LearnHelperUtil = require('../thulib/learnhelper')
const CicLearnHelperUtil = require('../thulib/cic_learnhelper')
const {Notice, Document, Assignment, Course} = require('../models/course')

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

      const noticePs = results[0].map(notice => new Promise(async resolve => {
        resolve((await (new Notice(notice)).save())._id)
      }))
      notices = await Promise.all(noticePs)

      const documentPs = results[1].map(document => new Promise(async resolve => {
        resolve((await (new Document(document)).save())._id)
      }))
      documents = await Promise.all(documentPs)

      const assignmentPs = results[2].map(assignment => new Promise(async resolve => {
        resolve((await (new Assignment(assignment)).save())._id)
      }))
      assignments = await Promise.all(assignmentPs)

      ;[course.teacher, course.email, course.phone] = results[3]
    } else {
      const taskPs = [
        lhu.getNotices, lhu.getDocuments, lhu.getAssignments
      ].map(task => new Promise(async (resolve) => {
        const result = await task.call(lhu, course)
        resolve(result)
      }))

      const results = await Promise.all(taskPs)

      const noticePs = results[0].map(notice => new Promise(async resolve => {
        resolve((await (new Notice(notice)).save())._id)
      }))
      notices = await Promise.all(noticePs)

      const documentPs = results[1].map(document => new Promise(async resolve => {
        resolve((await (new Document(document)).save())._id)
      }))
      documents = await Promise.all(documentPs)

      const assignmentPs = results[2].map(assignment => new Promise(async resolve => {
        resolve((await (new Assignment(assignment)).save())._id)
      }))
      assignments = await Promise.all(assignmentPs)
    }

    const courseObj = new Course({
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

    await courseObj.save()

    resolve(courseObj._id)
  }))

  user.courses = await Promise.all(ps)
  console.log('update learnhelper info done')

  await user.save()
}

module.exports = updateCourseInfo
