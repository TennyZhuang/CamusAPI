/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const User = require('../models/user')

const getCourseList = async(username) => {
  const user = await User.findOne({username: username})
  return user.courses
}

module.exports = getCourseList
