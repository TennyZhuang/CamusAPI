/**
 * Created by XiYe on 12/23/2016.
 */

const sleep = require('es6-sleep').promise
const ScheduleUtil = require('../thulib/schedule')
const WeekSchedule = require('../models/schedule').WeekScedule
const getTeachingInfo = require('./get_teaching_info')

const updateScheduleInfo = async (user) => {
  const teachingInfo = await getTeachingInfo()
  const currentWeek = parseInt(teachingInfo.currentTeachingWeek.name)
  for (let i = 0; i < 3; ++i) {
    try {
      const isUndergraduate = user.info.position === 'undergraduate'
      const scheduleInfo = await
        ScheduleUtil.getSchedule(user.username, user.getPassword(), isUndergraduate, currentWeek)
      user.schedule = []
      let weekID = 1
      for (const weekSche of scheduleInfo) {
        const weekModel = new WeekSchedule()
        weekModel.week = weekID
        weekModel.weekSchedule = []
        for (const weekS of weekSche) {
          weekModel.weekSchedule.push({
            place: weekS.place,
            type: weekS.type,
            startTime: weekS.startTime,
            dueTime: weekS.dueTime,
            date: weekS.date,
            content: weekS.content,
          })
        }
        user.schedule.push(weekModel)
        ++weekID
      }
      await user.save()
      console.error(`Succeed to update ${user.username} schedule`)
      break
    }
    catch (e) {
      await sleep(1000)
      if (i === 2) {
        console.error(`Fail to update ${user.username} schedule`)
      }
    }
  }
}

module.exports = updateScheduleInfo
