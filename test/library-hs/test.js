const lib = require('../../app/thulib/library')
const nock = require('nock')
const readFile = require('fs-readfile-promise')

describe('Test For Library Utility', () => {
  describe('1. test method "fetch"', function () {
    it('1.1 should response 200 with seat info', async () => {
      const outerDomain = 'http://seat.lib.tsinghua.edu.cn'
      const outerPath = '/roomshow/'
      const fileName = 'test.html'
      const htmlResponse = await readFile(`${__dirname}\\${fileName}`)

      nock(outerDomain)
        .get(outerPath)
        .query((query) => {
          return (query == null)
        })
        .reply(200, htmlResponse)
      
      await lib.fetch()
      const areas = lib.result
      
      areas.should.be.Array().and.have.lengthOf(8)
      
      const area = areas[0]
      area.should.have.properties(['name', 'left', 'used'])
      area.left.should.be.a.Number()
      area.left.should.be.aboveOrEqual(0)
      area.used.should.be.a.Number()
      area.used.should.be.aboveOrEqual(0)
    })
  })
})
