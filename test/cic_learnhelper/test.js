/**
 * Created by Ma_Zi_jun on 2016/12/29.
 */
/* Test flow
 Test 3 class functions
 1. Mock html reply to test `getDocuments` function
 2. Mock html reply to test `getAssignments` function
 3. Mock html reply to test `getNotices` function
 4. Mock html reply to test `getTeacherInfo` function
 */

const CicLearnHelperUtil = require('../../app/thulib/cic_learnhelper')
const cicLearnHelper = new CicLearnHelperUtil('xxx', 'xxxx')
const nock = require('nock')
const readFile = require('fs-readfile-promise')
const sleep = require('es6-sleep').promise

const assertDocs = (docs) => {
  docs.should.be.Array().and.should.not.be.empty()

  const doc = docs[0]
  const properties = ['title', 'explanation', 'size', 'updatingTime', 'state',
    'size', 'url']

  doc.should.have.properties(properties)

  doc.updatingTime.should.be.Number().and.aboveOrEqual(0)

  doc.state.should.match(/new|previous|unknown/)
}

const assertAssignments = (assignments) => {
  assignments.should.be.Array().and.should.not.be.empty()

  const assignment = assignments[0]

  const properties = ['title', 'startDate', 'dueDate', 'state', 'size', 'assignmentID', 'detail', 'filename', 'fileUrl',
    'evaluatingTeacher', 'evaluatingDate', 'scored', 'grade', 'comment']

  assignment.should.have.properties(properties)

  assignment.startDate.should.be.Number().and.aboveOrEqual(0)
  assignment.dueDate.should.be.Number().and.aboveOrEqual(0)
  assignment.evaluatingDate.should.be.Number().and.aboveOrEqual(0)

  assignment.state.should.match(/已经提交|尚未提交/)
  assignment.scored.should.be.Boolean()
}

const assertNotices = (notices) => {
  notices.should.be.Array().and.should.not.be.empty()
  const notice = notices[0]
  const properties = ['noticeID', 'title', 'publisher', 'publishTime', 'state', 'content']

  notice.should.have.properties(properties)
  notice.state.should.match(/read|unread/)

  notice.publishTime.should.be.Number().and.aboveOrEqual(0)
}

const assertCurrentTeachingInfo = (info) => {
  info.time.should.be.Number().and.aboveOrEqual(0)
  const beginTime = info.currentSemester.beginTime
  const endTime = info.currentSemester.endTime
  beginTime.should.be.Number().and.aboveOrEqual(0)
  endTime.should.be.Number().and.aboveOrEqual(0)
  endTime.should.be.above(beginTime)
}

const assertTeacherInfo = (info) => {
  info.should.be.Array().and.have.length(3)
  info[1].should.match(/@/)
}

const testCicLearnHelper = () => {
  describe('Test for CicLearHelperUtil Class', () => {
    describe('1. test method "getTeacherInfo"', function () {
      // avoid timeout error
      this.timeout(0)
      it('1.1 teacher info should be returned', async () => {
        const response = await readFile(`${__dirname}/test-teacher.json`)
        const responseObject = JSON.parse(response.toString())
        const outerDomain = 'http://learn.cic.tsinghua.edu.cn/'
        const courseID = '2016-2017-1-20250163-0'

        nock(outerDomain)
          .post(`/b/mycourse/SpeakTeacher/list/${courseID}`)
          .reply(200, responseObject)

        const teacherInfo = await cicLearnHelper.getTeacherInfo(courseID)

        assertTeacherInfo(teacherInfo)
      })
    })

    describe('2. test method "getNotices"', function () {
      // avoid timeout error
      this.timeout(0)
      it('2.1 course notices info should be returned', async () => {
        const response = await readFile(`${__dirname}/test-notice.json`)
        const responseObject = JSON.parse(response.toString())
        const outerDomain = 'http://learn.cic.tsinghua.edu.cn/'
        const courseID = '2016-2017-1-00050071-90'

        nock(outerDomain)
          .get(`/b/myCourse/notice/listForStudent/${courseID}?currentPage=1&pageSize=1000`)
          .reply(200, responseObject)

        const noticeIDs = [1480494129927, 1478006959550, 1477755480247, 1477755131965,
          1474529329078, 1474529327076, 1474529323531]

        noticeIDs.forEach(async (ele, index) => {
          const noticeResponse = await readFile(`${__dirname}/test-notice-info/notice-info-${index}.json`)
          const noticeResponseObject = JSON.parse(noticeResponse.toString())
          nock(outerDomain)
            .get(`/b/myCourse/notice/studDetail/${ele}`)
            .reply(200, noticeResponseObject)
        })

        await sleep(2000)

        const notices = await cicLearnHelper.getNotices(courseID)
        assertNotices(notices)
        // console.log('notices = ', notices)
      })
    })

    describe('3. test method "getDocuments"', function () {
      // avoid timeout error
      this.timeout(0)
      it('3.1 document info should be returned', async () => {
        const response = await readFile(`${__dirname}/test-doc.json`)
        const responseObject = JSON.parse(response.toString())
        const outerDomain = 'http://learn.cic.tsinghua.edu.cn/'
        const courseID = '2016-2017-1-20250163-0'

        nock(outerDomain)
          .get(`/b/myCourse/tree/getCoursewareTreeData/${courseID}/0`)
          .reply(200, responseObject)

        const docs = await cicLearnHelper.getDocuments(courseID)
        assertDocs(docs)
        // console.log('docs = ', docs)
      })
    })

    describe('4. test method "getAssignments"', function () {
      // avoid timeout error
      this.timeout(0)
      it('4.1 assignment info should be returned', async () => {
        const response = await readFile(`${__dirname}/test-assignment.json`)
        const responseObject = JSON.parse(response.toString())
        const outerDomain = 'http://learn.cic.tsinghua.edu.cn/'
        const courseID = '2016-2017-1-20250163-0'

        nock(outerDomain)
          .get(`/b/myCourse/homework/list4Student/${courseID}/0`)
          .reply(200, responseObject)

        const assignments = await cicLearnHelper.getAssignments(courseID)
        assertAssignments(assignments)
        // console.log('assignment = ', assignments)
      })
    })

    describe('5. test method "getCurrentTeachingInfo"', function () {
      // avoid timeout error
      this.timeout(0)
      it('5.1 teaching info should be returned', async () => {
        const response = await readFile(`${__dirname}/test-current.json`)
        const responseObject = JSON.parse(response.toString())
        const outerDomain = 'http://learn.cic.tsinghua.edu.cn/'
        const courseID = '2016-2017-1-20250163-0'

        nock(outerDomain)
          .get('/b/myCourse/courseList/getCurrentTeachingWeek')
          .reply(200, responseObject)

        const currentTeachingInfo = await cicLearnHelper.getCurrentTeachingInfo(courseID)

        assertCurrentTeachingInfo(currentTeachingInfo)
      })
    })
  })
}

module.exports = testCicLearnHelper

