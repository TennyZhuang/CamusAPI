/**
 * Created by XiYe on 12/1/2016.
 */

const CurriculumUtil = require('../thulib/curriculum')

const updateCurriculumInfo = async(user) => {
  for (let i = 0; i < 3; ++i) {
    try {
      const isUndergraduate = user.info.position === 'undergraduate'
      const curriculumInfo = await
        CurriculumUtil.getFirstLevelCurriculum(user.username, user.password, isUndergraduate)

      user.curriculum = []
      for (const curriculumClass of curriculumInfo) {
        user.curriculum.push({
          courseName: curriculumClass['coursename'],
          courseID: curriculumClass['courseid'],
          courseSequence: curriculumClass['coursesequence'],
          classroom: curriculumClass['classroom'],
          teacher: curriculumClass['teacher'],
          time: curriculumClass['time'],
          week: curriculumClass['week']
        })
      }
      await user.save()
      break
    }
    catch (e) {
      if (i === 2) {
        console.error('Fail to update Curriculum')
      }
    }
  }
}

module.exports = updateCurriculumInfo
