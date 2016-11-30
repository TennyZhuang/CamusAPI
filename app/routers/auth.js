const Router = require('koa-router')
const register = require('../tasks/register')
const cancel = require('../tasks/cancel')

const router = new Router({
  prefix: '/students'
})

router.post('/register', async (ctx) => {
  const {username, password} = ctx.request.fields || {}
  if (!username || !password) {
    ctx.throw(400, 'Missing Arguments')
  }

  const [user, existed] = await register(username, password)

  ctx.body = {
    username: username
  }

  if (user) {
    ctx.body.message = 'Success'
    ctx.body.existed = existed
    ctx.body.information = user.info.toObject()
  } else {
    ctx.body.message = 'Failure'
  }
})

router.post('/:username/cancel', async (ctx) => {
  const {username} = ctx.params

  const removed = await cancel(username)

  ctx.body = {
    username: username
  }

  ctx.res.statusCode = removed ? 200 : 400
})

exports.router = router
