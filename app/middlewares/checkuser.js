/**
 * Created by tianyizhuang on 02/12/2016.
 */

const User = require('../models/user')

const checkUser = async (username, ctx, next) => {
  const user = await User.findOne({username: username})
  if (user) {
    ctx.user = user
    await next()
  } else {
    ctx.throw(400)
  }
}

module.exports = checkUser
