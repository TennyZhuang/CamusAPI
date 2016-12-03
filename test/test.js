/**
 * Created by Ma_Zi_jun on 2016/12/1.
 */
const request = require('supertest')
const app = require('../app/index')
const testAuthFeature = require('./auth/test')
const testLibraryFeature = require('./library-hs/test')

const agent = request.agent(app.listen())

testAuthFeature(agent)

testLibraryFeature(agent)
