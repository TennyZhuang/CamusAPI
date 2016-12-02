/**
 * Created by Ma_Zi_jun on 2016/12/1.
 */
const nock = require('nock')
const readFile = require('fs-readfile-promise')

const app = require('../app/index')
const request = require('supertest').agent(app.listen())



describe('Test For Authentication Feature', () => {
  describe('With incomplete data', () => {
    it('should response 400 with missing arguments', (done) => {
      request
        .post('/users/register')
        .send({username: 'user'})
        .expect('Content-Type', /text/)
        .expect(400)
        .expect(/Missing Arguments/, done)
    })
  })
  
  describe('With invalid data', () => {
    before(() => {
      const outerDomain = 'https://id.tsinghua.edu.cn'
      const appID = 'ALL_ZHJW'
      const outerPath = `/thuser/authapi/login/${appID}/0_0_0_0`
      const response = {
        authCode: 261,
        status: 'RESTLOGIN_ERROR_AUTH'
      }
      
      nock(outerDomain)
        .post(outerPath)
        .reply(400, response)
    })
    
    it('should response 400 with message Failure', (done) => {
      request
        .post('/users/register')
        .send({username: 'user', password: 'invalid'})
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({message: 'Failure', username: 'user'}, done)
    })
  })
  
  describe('With valid data', () => {
    // we cannot mock the right ticket of the outer service
    // TODO: provide a valid username and password to pass this describe
    const validUserName = 'a valid user name'
    const validPassword = 'a valid password'
    const validSubKeys = ['studentnumber', 'realname', 'position', 'department', 'email']
    const positions = ['undergraduate', 'master', 'doctor', 'teacher']
    
    it('should response 200 with message Success', (done) => {
      request
        .post('/users/register')
        .send({username: validUserName, password: validPassword})
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          res.body.should.containEql({message: 'Success', username: validUserName})
          res.body.should.have.properties(['existed', 'information'])
          res.body.existed.should.be.a.Boolean()
          const info = res.body.information
          info.should.have.properties(validSubKeys)
          info.position.should.be.equalOneOf(positions)
        })
        .end(done)
    })
  })
})


describe('Test For Library Feature', () => {
  describe('Should return libray seats info', () => {
    it('should response 200 with message success', (done) => {
      const nockWithHtmlResponse = async function (outerDomain, outerPath, fileName) {
        const htmlResponse = await readFile(fileName)

        nock(outerDomain)
          .get(outerPath)
          .reply(200, htmlResponse)
      }

      before(() => {
        const outerDomain = 'http://seat.lib.tsinghua.edu.cn/'
        const outerPath = '/roomshow'
        const fileName = 'test.html'

        nockWithHtmlResponse(outerDomain, outerPath, fileName)
      })

      request
        .post('/library/hs')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          res.body.should.have.property('message', 'Success')
          res.body.should.have.property('areas')
          res.body.areas.should.be.Array().and.have.lengthOf(8)

          const area = res.body.areas[0]

          area.should.have.properties(['name', 'left', 'used'])
          area.left.should.be.a.Number()
          area.left.should.be.aboveOrEqual(0)
          area.used.should.be.a.Number()
          area.used.should.be.aboveOrEqual(0)
        })
        .end(done)
    })
  })
})
