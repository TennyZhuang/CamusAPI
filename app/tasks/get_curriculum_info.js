/**
 * Created by XiYe on 12/1/2016.
 */

const User = require('../models/user')

const getWeekCurriculumWithClassEntry = async(username, week) => {
  const user = await User.findOne({username: username})
  const weekFilter = (x) => {
    return x.week[week - 1] === 1
  }
  return user.curriculum.toObject().filter(weekFilter)
}

const getSemesterCurriculumWithClassEntry = async (username) => {
  const user = await User.findOne({username: username})
  return user.curriculum.toObject()
}

exports.getWeekCurriculumWithClassEntry = getWeekCurriculumWithClassEntry
exports.getSemesterCurriculumWithClassEntry = getSemesterCurriculumWithClassEntry
