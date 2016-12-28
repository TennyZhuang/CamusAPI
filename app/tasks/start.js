/**
 * Created by tianyizhuang on 30/11/2016.
 */

const LibraryUtil = require('../thulib/library')
const EventUtil = require('../thulib/event')
const taskScheduler = require('./task_scheduler')
const updateCourseInfo = require('./update_course_info')
const updateCurriculumInfo = require('./update_curriculum_info')
const updateTeachingInfo = require('./update_teaching_info')
const updateScheduleInfo = require('./update_schedule_info')
const User = require('../models/user')

const start = async () => {
  taskScheduler.add(LibraryUtil.fetch, null, 3600000)
  taskScheduler.add(EventUtil.fetch, null, 3600000)
  const users = await User.find({})
  const eventIDs = []
  users.forEach(async (user) => {
    eventIDs.push(await taskScheduler.add(updateCourseInfo, user, 3600000))
    eventIDs.push(await taskScheduler.add(updateCurriculumInfo, user, 3600000))
    eventIDs.push(await taskScheduler.add(updateScheduleInfo, user, 3600000))
    user._eventIDs = eventIDs
    await user.save()
  })

  taskScheduler.add(updateTeachingInfo, users[0], 3600000)
}

module.exports = start
