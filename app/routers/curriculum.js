/**
 * Created by XiYe on 12/2/2016.
 */

const Router = require('koa-router')
const curriculumGetter = require('../tasks/get_curriculum_info')
const getWeekCurriculumWithClassEntry =
  curriculumGetter.getWeekCurriculumWithClassEntry
const getSemesterCurriculumWithClassEntry =
  curriculumGetter.getSemesterCurriculumWithClassEntry
const checkUser = require('../middlewares/checkuser')

const router = new Router({
  prefix: '/schedule'
})

router.param('username', checkUser)

router.post('/byclass/:username/:week', async(ctx) => {
  const {week} = ctx.params
  const weekCurriculum =
    await getWeekCurriculumWithClassEntry(ctx.user, week)
  ctx.body = {
    message: 'Success',
    classes: weekCurriculum
  }
})

router.post('/byclass/:username', async (ctx) => {
  const semesterCurriculum =
    await getSemesterCurriculumWithClassEntry(ctx.user)
  ctx.body = {
    message: 'Success',
    classes: semesterCurriculum
  }
})
exports.router = router
