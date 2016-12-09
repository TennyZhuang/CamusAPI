const AuthUtil = require('../thulib/auth')
const User = require('../models/user')
const updateCourseInfo = require('./update_course_info')
const updateCurriculumInfo = require('./update_curriculum_info')
const taskSchedular = require('./task_schedular')

const register = async(username, password) => {
  const authResult = await AuthUtil.auth(username, password)

  if (authResult) {
    let user = await User.findOne({username: username})
    const existed = !!user

    if (!existed) {
      const info = await AuthUtil.getUserInfo(username, password)
      user = new User({
        username: username,
        password: password,
        info: info
      })

      await user.save()

      taskSchedular.add(updateCourseInfo, user, 300000)
      taskSchedular.add(updateCurriculumInfo, user, 300000)

    } else if (existed && user.getPassword() !== password) {
      user.password = password
      user.save()
    }

    return [user, existed]
  } else {
    return [null, false]
  }
}

module.exports = register
