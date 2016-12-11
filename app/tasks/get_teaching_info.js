/**
 * Created by Songzhou Yang on 12/11/2016.
 */

const TeachingInfo = require('../models/teaching_info')

const getTeachingInfo = async() => {
  const _info = await TeachingInfo.findOne({})
  const info = {}
  info.time = _info.time
  info.currentSemester = _info.currentSemester.toObject()
  info.currentTeachingWeek = _info.currentTeachingWeek.toObject()
  info.nextSemester = _info.nextSemester.toObject()
  return info
}

module.exports = getTeachingInfo
