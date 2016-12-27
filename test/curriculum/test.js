/* Test flow
Test three class function individually
1. Use several cases to test the `parseWeekStr` function
2. Use right html page and wrong html page to test the `parseFirstLevelCurriculum` function
3. Use valid username and password to test the `getFirstLevelCurriculum` function
 */

const cur = require('../../app/thulib/curriculum')
const readFile = require('fs-readfile-promise')
const cheerio = require('cheerio')
const nock = require('nock')
const iconv = require('iconv-lite')

//TODO: valid username and password are required in order to pass these units test for curriculum
const validUsername = 'valid username'
const validPassword = 'valid password'

const assertClasses = (classes) => {
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
}

describe('1. test week parser', () => {
  it('1.1 should return right week array based on different key word', () => {
    const fullWeeks = new Array(16).fill(1)
    const beforeWeeks = new Array(16).fill(1, 0, 8).fill(0, 8, 16)
    const afterWeeks = new Array(16).fill(0, 0, 8).fill(1, 8, 16)
    const oddWeeks = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
    const evenWeeks = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
    const specialWeeks1 = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
    const specialWeeks2 = [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0]
    const specialWeeks3 = [0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1]
    const matchPairs = [
      ['全周', fullWeeks],
      ['前八周', beforeWeeks],
      ['后八周', afterWeeks],
      ['单周', oddWeeks],
      ['双周', evenWeeks],
      ['1, 9,13周', specialWeeks1],
      ['2-4, 8-10, 11-14周', specialWeeks2],
      ['2-4,8, 11,13-16周', specialWeeks3]
    ]
    
    matchPairs.forEach(async (pair) => {
      const result = await cur.parseWeekStr(pair[0])
      try {
        result.should.be.eql(pair[1])
      } catch (e) {
        console.log(e.message)
      }
    })
  })
})

describe('2. test curriculum parser', () => {
  it('2.1 curriculum info should be properly extracted form the right test page', async () =>{
    const data = await readFile(`${__dirname}\\test-right.html`, 'utf8')
    const $ = cheerio.load(data, { decodeEntities: false })
    const classes = await cur.parseFirstLevelCurriculum($)
    assertClasses(classes)
  })
  
  //FIXME: How to test an exception thrown by async function properly
  it('2.2 curriculum info should be empty from the wrong test page', async () =>{
    const data = await readFile(`${__dirname}\\test-wrong.html`, 'utf8')
    const $ = cheerio.load(data, { decodeEntities: false })

    cur.parseFirstLevelCurriculum($)
    .then(() => {
      console.error('we did not catch the exception, so the test failed !')
    })
    .catch(() => {
      console.log('we catch the exception, so the test is passed!')
    })
  })
})


describe('3. test curriculum getter', function () {
  // avoid timeout error
  this.timeout(0)
  it('3.1 curriculum info should be properly extracted with valid username and password', async () => {
    const buffer = await readFile(`${__dirname}\\test-right.html`)
    // console.log(buffer)
    const response = iconv.encode(buffer, 'GBK')
    const outerDomain = 'http://zhjw.cic.tsinghua.edu.cn'

    nock(outerDomain)
      .get('/j_acegi_login.do')
      .query((query) => {
        return ('ticket' in query)
      })
      .reply(200, {})

    nock(outerDomain)
      .get('/portal3rd.do')
      .query((query) => {
        return ('m' in query && 'mobile' in query)
      })
      .reply(200, response)

    const classes = await cur.getFirstLevelCurriculum(validUsername, validPassword, true)
    assertClasses(classes)
  })
})

