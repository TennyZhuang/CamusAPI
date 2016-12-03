const nock = require('nock')
const readFile = require('fs-readfile-promise')

const testLibraryFeature = (agent) => {
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

        agent
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
}

module.exports = testLibraryFeature
