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
    // const data = await readFile(`${__dirname}/schedule.json`, 'utf8')
    // const schedules = await scheduleUtil.parseSchedule(data)
    schedules.should.be.Array().and.have.length(137)
  })
  it('1.2 should return a json with specific field', async () => {
    const properties = ['place', 'type', 'startTime', 'dueTime', 'date', 'content', 'description']
    schedules.forEach(async (item) => {
      item.should.have.properties(properties)
    })
  })
})

