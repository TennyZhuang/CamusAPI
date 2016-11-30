const Router = require('koa-router')
const register = require('../tasks/register')

const router = new Router({
  prefix: '/students'
})

router.post('/register', async ctx => {
  const {username, password} = ctx.request.fields || {}
  if (!username || !password) {
    ctx.throw(400, 'Missing Arguments')
  }

  const [user, existed] = await register(username, password)

  ctx.body = {
    username: username,
    existed: existed
  }

  if (user) {
    ctx.body.message = 'Success'
    ctx.body.information = user.info.toObject()
  } else {
    ctx.body.message = 'Failure'
  }
})

exports.router = router
