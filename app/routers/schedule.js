/**
 * Created by XiYe on 12/23/2016.
 */



const Router = require('koa-router')
const getScheduleInfo = require('../tasks/get_schedule_info')
const checkUser = require('../middlewares/checkuser')

const router = new Router({
  prefix: '/schedule'
})

router.param('username', checkUser)

router.post('/:username/:week', async(ctx) => {
  const {week} = ctx.params
  const weekSchedule =
    await getScheduleInfo(ctx.user, week)
  ctx.body.classes = weekSchedule
})

exports.router = router
