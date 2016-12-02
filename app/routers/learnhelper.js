/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const Router = require('koa-router')
const courseInfoGetter = require('../tasks/get_course_info')
const getCourseList = courseInfoGetter.getCourseList
const getCourse = courseInfoGetter.getCourse

const router = new Router({
  prefix: '/learnhelper'
})

router.post('/:username/courses', async(ctx) => {
  const {username} = ctx.params
  const courses = await getCourseList(username)

  ctx.body = {
    courses: courses.toObject()
  }
})

router.post('/:username/courses/:courseID/notices', async (ctx) => {
  const {username,courseID} = ctx.params
  const course = await getCourse(username, courseID)
  ctx.body = {
    notices: course.notices.toObject()
  }
})

exports.router = router
