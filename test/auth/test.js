/**
 * Created by Ma_Zi_jun on 2016/12/3.
 */
const nock = require('nock')

const testAuthFeature = (agent) => {
  describe('Test For Authentication Feature', () => {
    describe('With incomplete data', () => {
      it('should response 400 with missing arguments', (done) => {
        agent
          .post('/users/register')
          .send({username: 'user'})
          .expect('Content-Type', /text/)
          .expect(400)
          .expect(/Missing Arguments/, done)
      })
    })

    describe('With invalid data', () => {
      it('should response 400 with message Failure', (done) => {
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

        agent
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
        agent
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
}

module.exports = testAuthFeature
