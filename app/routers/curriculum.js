/**
 * Created by XiYe on 12/2/2016.
 */

const Router = require('koa-router')
const curriculumGetter = require('../tasks/get_curriculum_info')
const getWeekCurriculumWithClassEntry =
  curriculumGetter.getWeekCurriculumWithClassEntry
const getSemesterCurriculumWithClassEntry =
  curriculumGetter.getSemesterCurriculumWithClassEntry

const router = new Router({
  prefix: '/schedule'
})

router.post('/byclass/:username/:week', async(ctx) => {
  const {username, week} = ctx.params
  const weekCurriculum =
    await getWeekCurriculumWithClassEntry(username, week)
  ctx.body = {
    message: 'Success',
    username: username,
    classes: weekCurriculum
  }
})

router.post('/byclass/:username', async (ctx) => {
  const {username} = ctx.params
  const semesterCurriculum =
    await getSemesterCurriculumWithClassEntry(username)
  ctx.body = {
    message: 'Success',
    username: username,
    classes: semesterCurriculum
  }
})
exports.router = router
