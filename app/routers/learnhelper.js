/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const Router = require('koa-router')
const checkUser = require('../middlewares/checkuser')
const checkCourse = require('../middlewares/checkcourse')

const router = new Router({
  prefix: '/learnhelper'
})

router.param('courseID', checkCourse)

router.param('username', checkUser)

router.post('/:username/courses', async(ctx) => {
  const user = ctx.user

  ctx.body.courses = user.courses.toObject()
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
