/**
 * Created by Ma_Zi_jun on 2016/12/9.
 */

const courseInfoGetter = require('../tasks/get_course_info')
const getCourse = courseInfoGetter.getCourse

const checkCourse = async (courseID, ctx, next) => {
  ctx.body = ctx.body || {}
  ctx.body.courseid = courseID
  const course = await getCourse(ctx.user, courseID)
  if (course) {
    ctx.course = course 
    await next()
  } else {
    throw new Error('Invalid courseID')
  }
}

module.exports = checkCourse
