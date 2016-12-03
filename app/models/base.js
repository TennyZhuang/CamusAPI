const mongoose = require('mongoose')
const config = require('../config')

mongoose.Promise = global.Promise

const connect = () => {
  mongoose.connect(config.mongodbUrl)
  console.log('Connecting to mongodb at:', config.mongodbUrl)
}

exports.connect = connect
