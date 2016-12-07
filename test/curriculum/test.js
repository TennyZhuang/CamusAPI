/* Test flow
1. Use a local html page to see if parser could extract correct message from the page.
 */
const cur = require('../../app/thulib/curriculum')
const readFile = require('fs-readfile-promise')
const cheerio = require('cheerio')

testParser = async () => {
  console.log(__dirname)
  const data = await readFile(`${__dirname}\\test.html`, 'utf8')
  console.log(data)

  const $ = cheerio.load(data, { decodeEntities: false })
  const classes = await cur.parseFirstLevelCurriculum($)
  console.log(classes)

  describe('1. test parser', () => {
    it('1.1 curriculum info should be properly extracted form the right test page', () =>{
      classes.should.be.Array().and.should.not.be.empty()
    })
  })

}

testParser()
