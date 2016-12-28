/**
 * Created by XiYe on 12/1/2016.
 */

const sleep = require('es6-sleep').promise
const CurriculumUtil = require('../thulib/curriculum')

const updateCurriculumInfo = async(user) => {
  for (let i = 0; i < 3; ++i) {
    try {
      const isUndergraduate = user.info.position === 'undergraduate'
      const curriculumInfo = await
        CurriculumUtil.getFirstLevelCurriculum(user.username, user.getPassword(), isUndergraduate)

      user.curriculum = []
      for (const curriculumClass of curriculumInfo) {
        user.curriculum.push({
          courseName: curriculumClass.coursename,
          courseID: curriculumClass.courseid,
          classroom: curriculumClass.classroom,
          teacher: curriculumClass.teacher,
          time: curriculumClass.time,
          week: curriculumClass.week
        })
      }
      await user.save()
      console.error(`Succeed to update ${user.username} Curriculum`)
      break
    }
    catch (e) {
      await sleep(1000)
      if (i === 2) {
        console.error(`Fail to update ${user.username} Curriculum`)
      }
    }
  }
}

module.exports = updateCurriculumInfo
