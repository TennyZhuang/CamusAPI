const http = require('http')
const rp = require('request-promise')
const config = require('../config')

const pool = new http.Agent()
pool.maxSockets = config.requestPoolSize

exports.rp = rp.defaults({pool: pool})
