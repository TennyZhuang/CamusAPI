/**
 * Created by XiYe on 12/1/2016.
 */

const getWeekCurriculumWithClassEntry = async(user, week) => {
  const weekFilter = (x) => {
    return x.week[week - 1] === 1
  }
  return user.curriculum.toObject().filter(weekFilter)
}

const getSemesterCurriculumWithClassEntry = async (user) => {
  return user.curriculum.toObject()
}

exports.getWeekCurriculumWithClassEntry = getWeekCurriculumWithClassEntry
exports.getSemesterCurriculumWithClassEntry = getSemesterCurriculumWithClassEntry
