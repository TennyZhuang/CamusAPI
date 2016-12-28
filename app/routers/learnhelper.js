/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const Router = require('koa-router')
const checkUser = require('../middlewares/checkuser')
const checkCourse = require('../middlewares/checkcourse')
const getCourse = require('../tasks/get_course_info').getCourse

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

  ctx.body.notices = course.notices.toObject()
})

router.post('/:username/courses/:courseID/documents', async(ctx) => {
  const course = ctx.course

  ctx.body.documents = course.documents.toObject()
})

router.post('/:username/courses/:courseID/assignments', async(ctx) => {
  const course = ctx.course

  ctx.body.assignments = course.assignments.toObject()
})

exports.router = router
