const Router = require('koa-router')
const register = require('../tasks/register')
const cancel = require('../tasks/cancel')
const checkUser = require('../middlewares/checkuser')

const router = new Router({
  prefix: '/users'
})

router.param('username', checkUser)

router.post('/register', async (ctx) => {
  const {username, password} = ctx.request.fields || {}
  if (!username || !password) {
    throw new Error('Missing Arguments')
  }

  const [user, existed] = await register(username, password)

  ctx.body = {
    username: username
  }

  if (user) {
    ctx.body.existed = existed
    ctx.body.information = user.info.toObject()
  } else {
    throw new Error('Auth failed')
  }
})

router.post('/:username/cancel', async (ctx) => {
  const {username} = ctx.params

  const removed = await cancel(username)

  if (!removed) {
    throw new Error('Remove failed')
  }
})

exports.router = router
