/**
 * Created by Ma_Zi_jun on 2016/12/1.
 */
const request = require('supertest')

const app = require('../app/index')

const testAuthFeature = require('./auth/test')
const testLibraryFeature = require('./library-hs/test')
const testCancelFeature = require('./cancel/test')

const agent = request.agent(app.listen())

//TODO: Provide validUsername and validPassword to pass all the test
const validUsername = 'username'
const validPassword = 'password'

testAuthFeature(agent, validUsername, validPassword)

testLibraryFeature(agent)

testCancelFeature(agent, validUsername)
