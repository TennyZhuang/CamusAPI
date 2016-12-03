/**
 * Created by Ma_Zi_jun on 2016/12/3.
 */

/* Test summary for this function:
 1. With incomplete post data, the response show miss arguments
 2.1 With valid (username, password) for the first time, the response show success and existed = true
 2.2 With valid (username, password) for the second time, the response show success and existed = false
 3. With valid username and invalid password, the response show failure
 4. With invalid (username, password), the response show failure
 */

const nock = require('nock')

const testAuthFeature = (agent, validUsername, validPassword) => {
  describe('Test For Authentication Feature', () => {
    describe('1. With incomplete data', () => {
      it('should response 400 with missing arguments', (done) => {
        agent
          .post('/users/register')
          .send({username: 'xxx'})
          .expect('Content-Type', /text/)
          .expect(400)
          .expect(/Missing Arguments/, done)
      })
    })

    describe('2. With valid (username, password) for twice', () => {
      const validSubKeys = ['studentnumber', 'realname', 'position', 'department', 'email']
      const positions = ['undergraduate', 'master', 'doctor', 'teacher']

      //TODO: This needs mock for outer service but I can't figure out the way
      it('2.1 should response 200 with message Success but existed false', (done) => {
        agent
          .post('/users/register')
          .send({username: validUsername, password: validPassword})
          .expect(200)
          .expect('Content-Type', /json/)
          .expect((res) => {
            res.body.should.containEql({message: 'Success', username: validUsername, existed: false})
            res.body.should.have.property('information')
            const info = res.body.information
            info.should.have.properties(validSubKeys)
            info.position.should.be.equalOneOf(positions)
          })
          .end(done)
      })

      it('2.2 should response 200 with message Success but existed true', (done) => {
        agent
          .post('/users/register')
          .send({username: validUsername, password: validPassword})
          .expect(200)
          .expect((res) => {
            res.body.should.have.property('existed', true)
          })
          .end(done)
      })
    })

    describe('3. With valid username and but invalid password', () => {
      it('should response 400 with message Failure', (done) => {
        //TODO: The test can't be passed currently. Correct the app code.
        agent
          .post('/users/register')
          .send({username: validUsername, password: 'xxx'})
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({message: 'Failure', username: 'xxx'}, done)
      })
    })

    describe('4. With invalid (username, password) ', () => {
      it('should response 400 with message Failure', (done) => {
        const outerDomain = 'https://id.tsinghua.edu.cn'
        const appID = 'ALL_ZHJW'
        const outerPath = `/thuser/authapi/login/${appID}/0_0_0_0`
        const response = {
          authCode: 266,
          status: 'RESTLOGIN_ERROR_AUTH'
        }

        nock(outerDomain)
          .post(outerPath)
          .reply(400, response)

        agent
          .post('/users/register')
          .send({username: 'xxx', password: 'xxx'})
          .expect(400)
          .expect('Content-Type', /json/)
          .expect({message: 'Failure', username: 'xxx'}, done)
      })
    })
  })
}

module.exports = testAuthFeature
