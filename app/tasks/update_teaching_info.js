/**
 * Created by Songzhou Yang on 12/11/2016.
 */

const CicLearnHelperUtil = require('../thulib/cic_learnhelper')
const TeachingInfo = require('../models/teaching_info')

const updateTeachingInfo = async(user) => {
  const cicLhu = new CicLearnHelperUtil(user.username, user.getPassword())
  await cicLhu.login()
  const _info = await cicLhu.getCurrentTeachingInfo()
  await TeachingInfo.find({}).remove().exec()
  const info = new TeachingInfo({
    time: _info.time,
    currentSemester: _info.currentSemester,
    currentTeachingWeek: _info.currentTeachingWeek,
    nextSemester: _info.nextSemester
  })

  console.log('Update Teaching Info Done')

  await info.save()
}

module.exports = updateTeachingInfo
