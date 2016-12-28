/**
 * Created by XiYe on 12/29/2016.
 */

const scheduleUtil = require('../../app/thulib/schedule')
const readFile = require('fs-readfile-promise')
const nock = require('nock')

//TODO: valid username and password are required in order to pass these units test for curriculum
const validUsername = 'valid username'
const validPassword = 'valid password'

const assertSchedules = (schedules) => {
  schedules.should.be.Array().and.should.not.be.empty()

  const week1Schedules = schedules[0]
  const properties = ['place', 'type', 'startTime', 'dueTime', 'date', 'content', 'description']
  week1Schedules.forEach(async (item) => {
    item.should.have.properties(properties)
  })

  const classActivity = week1Schedules[0]
  classActivity.place.should.be.eql('六教6A018')
  classActivity.type.should.be.eql('上课')
  classActivity.dueTime.should.be.eql('16:55')
  classActivity.startTime.should.be.eql('15:20')
  classActivity.date.should.be.eql('2016-09-12')
  classActivity.content.should.be.eql('模式识别基础')
  classActivity.description.should.be.eql('')

  const week17Schedules = schedules[16]
  const examActivity = week17Schedules[0]
  examActivity.type.should.be.eql('考试')
}

const testSchedule = () => {
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
      const ticketDomain = 'https://id.tsinghua.edu.cn'
      nock(ticketDomain)
        .post('/thuser/authapi/login/ALL_ZHJW/0_0_0_0')
        .reply(200, '{ \"status\": \"RESTLOGIN_OK\", \"ticket\": \"ticket\" }')

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

      const schedules = await scheduleUtil.getSchedule(validUsername, validPassword, true, 1)
      assertSchedules(schedules)
    })
  })
}

module.exports = testSchedule
