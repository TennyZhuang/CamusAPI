const mongoose = require('mongoose')
const config = require('../config').config

const connect = () => {
  mongoose.connect(config.mongodbUrl)
}

exports.connect = connect
