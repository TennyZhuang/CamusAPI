/**
 * Created by XiYe on 12/6/2016.
 */

const Router = require('koa-router')
const EventUtil = require('../thulib/event')

const router = new Router({
  prefix: '/events'
})

router.post('/', async (ctx) => {
  try {
    ctx.body = {
      message: 'Success',
      events: EventUtil.getEventList()
    }
  } catch (e) {
    ctx.body = {
      message: 'Failure',
    }
  }
})

exports.router = router
