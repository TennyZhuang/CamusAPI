/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const Router = require('koa-router')
const courseInfoGetter = require('../tasks/get_course_info')
const getCourse = courseInfoGetter.getCourse
const checkUser = require('../middlewares/checkuser')

const router = new Router({
  prefix: '/learnhelper'
})

router.param('username', checkUser)

router.post('/:username/courses', async(ctx) => {
  const user = ctx.user

  ctx.body = {
    courses: user.courses.toObject()
  }
})

router.post('/:username/courses/:courseID/notices', async(ctx) => {
  const {courseID} = ctx.params
  const course = await getCourse(ctx.user, courseID)
  ctx.body = {
    notices: course.notices.toObject()
  }
})

router.post('/:username/courses/:courseID/documents', async(ctx) => {
  const {courseID} = ctx.params
  const course = await getCourse(ctx.user, courseID)
  ctx.body = {
    notices: course.documents.toObject()
  }
})

router.post('/:username/courses/:courseID/assignments', async(ctx) => {
  const {courseID} = ctx.params
  const course = await getCourse(ctx.user, courseID)
  ctx.body = {
    notices: course.assignments.toObject()
  }
})

exports.router = router
