/**
 * Created by XiYe on 12/1/2016.
 */

const User = require('../models/user')

const getWeekCurriculumWithClassEntry = async(username, week) => {
  const user = await User.findOne({username}).populate('courses')
  const filter = (x) => {
    return x.week[week - 1] === 1
  }
  const weekCurriculum = user.curriculum.find(filter)
  return weekCurriculum
}

const getSemesterCurriculumWithClassEntry = async (username) => {
  const user = await User.findOne({username: username})
  return user.curriculum

}

exports.getWeekCurriculumWithClassEntry = getWeekCurriculumWithClassEntry
exports.getSemesterCurriculumWithClassEntry = getSemesterCurriculumWithClassEntry
