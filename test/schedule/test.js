/**
 * Created by XiYe on 12/29/2016.
 */

const scheduleUtil = require('../../app/thulib/schedule')
const readFile = require('fs-readfile-promise')
const cheerio = require('cheerio')
const nock = require('nock')
const iconv = require('iconv-lite')

//TODO: valid username and password are required in order to pass these units test for curriculum
const validUsername = 'valid username'
const validPassword = 'valid password'

describe('1. test schedule parser', () => {
  let data = null
  let schedules = null
  before(async () => {
    data = await readFile(`${__dirname}/schedule.json`, 'utf8')
    schedules = await scheduleUtil.parseSchedule(data)
  })

  it('1.1 should return a schedules with right length', async () => {
    schedules.should.be.Array().and.have.length(137)
  })
  it('1.2 should return a json with specific field', async () => {
    const properties = ['place', 'type', 'startTime', 'dueTime', 'date', 'content', 'description']
    schedules.forEach(async (item) => {
      item.should.have.properties(properties)
    })
  })
})

describe('2. test schedules splitter', () => {
  it('2.1 should split schedules to 18 weeks', async() => {
    const data = await readFile(`${__dirname}/schedule.json`, 'utf8')
    const schedules = await scheduleUtil.parseSchedule(data)
    const weekSchedules = await scheduleUtil.splitSemesterSchedule(schedules)
    weekSchedules.should.be.Array().and.have.length(18)
  })
})

describe('3. test schedules getter', function () {
  // avoid timeout error
  this.timeout(0)
  it('3.1 curriculum info should be properly extracted with valid username and password', async () => {
    const buffer = await readFile(`${__dirname}/schedule.json`, 'utf8')
    const outerDomain = 'http://zhjw.cic.tsinghua.edu.cn'

    nock(outerDomain)
      .get('/j_acegi_login.do')
      .query((query) => {
        return ('ticket' in query)
      })
      .reply(200, {})

    nock(outerDomain)
      .get('/jxmh.do')
      .query((query) => {
        return ('m' in query && 'p_start_date' in query)
      })
      .reply(200, buffer)

    const classes = await scheduleUtil.getSchedule(validUsername, validPassword, true, 1)
    console.log(classes)
  })
})



