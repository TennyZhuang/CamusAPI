const AuthUtil = require('../thulib/auth')
const User = require('../models/user')
const updateCourseInfo = require('./update_course_info')
const updateCurriculumInfo = require('./update_curriculum_info')
const updateScheduleInfo = require('./update_schedule_info')
const taskScheduler = require('./task_scheduler')

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

      taskScheduler.add(updateCourseInfo, user, 3600000)
      taskScheduler.add(updateCurriculumInfo, user, 3600000)
      taskScheduler.add(updateScheduleInfo, user, 3600000)


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
