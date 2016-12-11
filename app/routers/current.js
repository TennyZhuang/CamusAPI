/**
 * Created by Songzhou Yang on 12/11/2016.
 */

const Router = require('koa-router')
const getTeachingInfo = require('../tasks/get_teaching_info')

const router = new Router({
  prefix: '/current'
})

router.post('/', async(ctx) => {
  ctx.body = {
    currentTeachingInfo: await getTeachingInfo()
  }
})

exports.router = router
