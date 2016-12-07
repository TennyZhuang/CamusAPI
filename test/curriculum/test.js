/* Test flow
1. Use a local html page to see if parser could extract correct message from the page.
 */
const cur = require('../../app/thulib/curriculum')
const readFile = require('fs-readfile-promise')
const cheerio = require('cheerio')

describe('1. test parser', () => {
  it('1.1 curriculum info should be properly extracted form the right test page', async () =>{
    const data = await readFile(`${__dirname}\\test-right.html`, 'utf8')
    const $ = cheerio.load(data, { decodeEntities: false })
    const classes = await cur.parseFirstLevelCurriculum($)
    classes.should.be.Array().and.should.not.be.empty()
    
    const lesson = classes[0]
    const properties = ['courseid', 'coursename', 'time', 'teacher', 'classroom', 'week']
    lesson.should.have.properties(properties)

    const time = lesson.time
    time.should.be.Array().and.have.length(2)
    time[0].should.be.Number().and.within(1, 7)
    time[1].should.be.Number().and.within(1, 6)

    const week = lesson.week
    week.should.be.Array().and.have.length(16)
    week.forEach((ele) => {
      ele.should.be.Number().and.within(0, 1)
    })
  })
  
  //FIXME: How to test an exception thrown by async function properly
  /*
  it('1.2 curriculum info should be empty from the wrong test page', async (done) =>{
    const data = await readFile(`${__dirname}\\test-wrong.html`, 'utf8')
    const $ = cheerio.load(data, { decodeEntities: false })

    const myFunc = () => { cur.parseFirstLevelCurriculum($) }
    assert.throws(myFunc)
  })
  */
})
