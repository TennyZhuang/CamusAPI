const Router = require('koa-router')

const router = new Router({
  prefix: '/auth'
})

router.get('/', async (ctx) => {
  ctx.body = 'Hello World'
})

exports.router = router
