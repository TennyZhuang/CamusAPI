/**
 * Created by Ma_Zi_jun on 2016/12/1.
 */
const nock = require('nock')
const config = require('../app/config')
const app = require('../app/index')
const request = require('supertest').agent(app.listen())

const apiAddress = 'https://id.tsinghua.edu.cn'
const appID = 'ALL_ZHJW'
const loginUrl = `/thuser/authapi/login/${appID}/0_0_0_0`


describe('Test For Authentication Feature', () => {
  describe('With incomplete data', () => {
    it('should response 400 with missing arguments', (done) => {
      request
        .post('/users/register')
        .send({username: "user"})
        .expect('Content-Type', /text/)
        .expect(400)
        .expect(/Missing Arguments/, done)
    })
  })
  describe('With invalid data', () => {
    before(() => {
      const response = {
        authCode: 261,
        status: 'RESTLOGIN_ERROR_AUTH'
      }
      nock(apiAddress)
        .post(loginUrl)
        .reply(400, response)
    })
    it('should response 400 with message Failure', (done) => {
      request
        .post('/users/register')
        .send({username: "user", password: "invalid"})
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({message: "Failure", username: "user"}, done)
    })
  })
  describe('With valid data', () => {
    // we cannot mock the right ticket of the outer service
    const validUserName = 'a valid username'
    const validPassword = 'a valid password'
    const validKeys = ['username', 'message', 'existed', 'information']
    const validSubKeys = ['studentnumber', 'realname', 'position', 'department', 'email']
    it('should response 200 with message Success', (done) => {
      request
        .post('/users/register')
        .send({username: validUserName, password: validPassword})
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          if (!(res.body.username === validUserName && res.body.message === 'Success')) {
            throw new Error('wrong value in response')
          }
          validKeys.forEach((key) => {
            if (!(key in res.body)) throw new Error(`missing ${key} key in response`)
          })
          validSubKeys.forEach((key) => {
            if (!(key in res.body.information)) throw new Error(`missing ${key} key in response information`)
          })
        })
        .end(done)
    })
  })
})
