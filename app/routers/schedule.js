/**
 * Created by XiYe on 12/23/2016.
 */



const Router = require('koa-router')
const getWeekScheduleInfo = require('../tasks/get_schedule_info').getWeekScheduleInfo
const checkUser = require('../middlewares/checkuser')

const router = new Router({
  prefix: '/schedule'
})

router.param('username', checkUser)

router.post('/:username/:week', async(ctx) => {
  const {week} = ctx.params
  const weekSchedule =
    await getWeekScheduleInfo(ctx.user, week)
  ctx.body.schedule = weekSchedule
})

exports.router = router
