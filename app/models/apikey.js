/**
 * Created by tianyizhuang on 10/12/2016.
 */

const mongoose = require('mongoose')

const ApiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    index: true,
    unique: true
  },
  secret: String
})

const ApiKey = mongoose.model('ApiKey', ApiKeySchema)

module.exports = ApiKey
