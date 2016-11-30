/**
 * Created by tianyizhuang on 30/11/2016.
 */

const User = require('../models/user')

const cancel = async(username) => {
  const result = (await User.find({username: username}).remove()).result
  return result.n >= 1
}

module.exports = cancel
