/**
 * Created by tianyizhuang on 02/12/2016.
 */

const User = require('../models/user')

const checkUser = async (username, ctx, next) => {
  ctx.body = ctx.body || {}
  ctx.body.username = username
  const user = await User.findOne({username: username})
  if (user) {
    ctx.user = user
    await next()
  } else {
    throw new Error('Invalid username')
  }

  ctx.body.username = username
}

module.exports = checkUser
