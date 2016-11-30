/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const Router = require('koa-router')
const getCourseList = require('../tasks/get_course_info')

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

exports.router = router
