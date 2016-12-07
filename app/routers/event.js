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
      events: EventUtil.getEventList()
    }
  } catch (e) {
    console.error(e)
    throw e
  }
})

exports.router = router
