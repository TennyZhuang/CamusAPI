const Router = require('koa-router')
const AuthUtil = require('../thulib/auth').AuthUtil

const router = new Router({
  prefix: '/students'
})

router.post('/register', async ctx => {
  const {username, password} = ctx.request.fields || {}
  if (!username || !password) {
    ctx.throw(400, 'Missing Arguments')
  }

  const result = await AuthUtil.auth(username, password)

  ctx.body = {
    username: username
  }

  if (result) {
    ctx.body.message = 'Success'
    ctx.body.information = await AuthUtil.getUserInfo(username, password)

    // TODO: save user
  } else {
    ctx.body.message = 'Failure'
  }
})

exports.router = router
