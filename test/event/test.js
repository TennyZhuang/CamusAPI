/* Test Flow
Test 3 class functions
1. Use right html page to test the `parseEvent` function
2. Mock html reply test the `getEventList` and `fetch` function
 */
const eve = require('../../app/thulib/event')
const readFile = require('fs-readfile-promise')
const cheerio = require('cheerio')
const nock = require('nock')
const iconv = require('iconv-lite')

const assertEvents = (events) => {
  events.should.be.Array().and.should.not.be.empty()
  const event = events[0]
  event.should.have.properties(['name', 'status', 'remainingdays'])
  event.status.should.match(/begin|end/)
  event.remainingdays.should.be.a.Number()
  event.remainingdays.should.be.aboveOrEqual(0)
}

describe('1. test method "parseEvents" ', () => {
  it('1.1 event info should be properly extracted with the right test page', async () =>{
    const data = await readFile(`${__dirname}\\test.html`, 'utf8')
    const $ = cheerio.load(data, { decodeEntities: false })
    
    const events = await eve.parseEvents($)
    events.should.be.Array().and.should.not.be.empty()

    assertEvents(events)
  })
})

describe('2. test function "fetch" and "getEventList"', function () {
  // avoid timeout error
  this.timeout(0)
  it('2.1 curriculum info should be get', async () => {
    const buffer = await readFile(`${__dirname}\\test.html`)
    // console.log(buffer)
    const response = iconv.encode(buffer, 'GBK')
    const outerDomain = 'http://zhjw.cic.tsinghua.edu.cn'

    nock(outerDomain)
      .get('/portal3rd.do')
      .query((query) => {
        return ('url' in query && 'm' in query)
      })
      .reply(200, response)

    await eve.fetch()
    const events = eve.getEventList()
    assertEvents(events)
  })
})
