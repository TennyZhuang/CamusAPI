/**
 * Created by tianyizhuang on 30/11/2016.
 */

const LibraryUtil = require('../thulib/library')
const taskSchedular = require('./task_schedular')

const start = () => {
  taskSchedular.add(LibraryUtil.fetch, 300000)
}

module.exports = start
