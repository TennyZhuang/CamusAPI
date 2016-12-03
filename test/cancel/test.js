/**
 * Created by Ma_Zi_jun on 2016/12/3.
 */

/* Test summary for this function:
 1. With invalid username, the response show failure
 2. With valid username for the first time, the response show success
 3. With valid username for the second time, the response show failure
 */

//TODO: Tests in this module needs to be passed. They all lack "message" field

const testCancelFeature = (agent, validUsername) => {
  describe('Test For Cancel Feature', () => {
    describe('With username invalid', () => {
      it('should response 400 with failure', (done) => {
        agent
          .post('/users/xxx/cancel')
          .send({})
          .expect('Content-Type', /json/)
          .expect(400)
          .expect({message: 'Failure', username: 'xxx'}, done)
      })
    })

    describe('With valid username for the first time', () => {
      it('should response 200 with success', (done) => {
        agent
          .post(`/users/${validUsername}/cancel`)
          .send({})
          .expect('Content-Type', /json/)
          .expect(200)
          .expect({message: 'Success', username: validUsername}, done)
      })
    })

    describe('With valid username for the second time', () => {
      it('should response 400 with failure', (done) => {
        agent
          .post(`/users/${validUsername}/cancel`)
          .send({})
          .expect('Content-Type', /json/)
          .expect(400)
          .expect({message: 'Failure', username: validUsername}, done)
      })
    })
  })
}

module.exports = testCancelFeature
