/**
 * Created by tianyizhuang on 30/11/2016.
 */

const LibraryUtil = require('../thulib/library')
const taskSchedular = require('./task_schedular')
const updateCourseInfo = require('./update_course_info')
const updateCurriculumInfo = require('./update_curriculum_info')
const User = require('../models/user')

const start = async () => {
  taskSchedular.add(LibraryUtil.fetch, 300000)
  const users = await User.find({})
  users.forEach((user) => {
    taskSchedular.add(updateCourseInfo, user, 300000)
    taskSchedular.add(updateCurriculumInfo, user, 300000)
  })
}

module.exports = start
