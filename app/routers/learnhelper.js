/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const Router = require('koa-router')
const checkUser = require('../middlewares/checkuser')
const checkCourse = require('../middlewares/checkcourse')
const getCourse = require('../tasks/get_course_info').getCourse
const {Notice, Document, Assignment} = require('../models/course')

const router = new Router({
  prefix: '/learnhelper'
})

router.param('courseID', checkCourse)

router.param('username', checkUser)

router.post('/:username/courses', async(ctx) => {
  const user = ctx.user
  const ps = user.courses.map(courseObjID =>
    new Promise(async resolve => {
      resolve((await getCourse(user, courseObjID)).toObject())
    })
  )

  const courses = await Promise.all(ps)
  ctx.body = courses
})

router.post('/:username/courses/:courseID/notices', async(ctx) => {
  const course = ctx.course

  const ps = course.notices.map(noticeObjID =>
    new Promise(async resolve => {
      resolve((await Notice.findOne({_id: noticeObjID})).toObject())
    })
  )

  const notices = await Promise.all(ps)

  ctx.body.notices = notices
})

router.post('/:username/courses/:courseID/documents', async(ctx) => {
  const course = ctx.course

  const ps = course.documents.map(documentObjID =>
    new Promise(async resolve => {
      resolve((await Document.findOne({_id: documentObjID})).toObject())
    })
  )

  const documents = await Promise.all(ps)

  ctx.body.documents = documents
})

router.post('/:username/courses/:courseID/assignments', async(ctx) => {
  const course = ctx.course

  const ps = course.assignments.map(assignmentObjID =>
    new Promise(async resolve => {
      resolve((await Assignment.findOne({_id: assignmentObjID})).toObject())
    })
  )

  const assignments = await Promise.all(ps)

  ctx.body.assignments = assignments
})

exports.router = router
