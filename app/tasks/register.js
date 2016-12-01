const AuthUtil = require('../thulib/auth')
const User = require('../models/user')
const updateCourseInfo = require('./update_course_info')
const taskSchedular = require('./task_schedular')

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

    taskSchedular.add(updateCourseInfo, user, 300000)
  }

  return [user, false]
}

module.exports = register
