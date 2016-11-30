const mongoose = require('mongoose')
const config = require('../config')

mongoose.Promise = global.Promise

const connect = () => {
  mongoose.connect(config.mongodbUrl)
}

exports.connect = connect
