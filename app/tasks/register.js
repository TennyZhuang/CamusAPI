const AuthUtil = require('../thulib/auth').AuthUtil
const User = require('../models/user')

const register = async (username, password) => {
  let user = await User.findOne({ username: username })
  if (user) {
    return [user, true]
  }

  const authResult = await AuthUtil.auth(username, password)

  if (authResult) {
    const info = await AuthUtil.getUserInfo(username, password)
    user = new User({
      username: username,
      password: password,
      info: info
    })

    await user.save()
  }

  return [user, false]
}

module.exports = register
