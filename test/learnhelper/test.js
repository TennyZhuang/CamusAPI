/* Test flow
 Test 3 class functions
 1. Mock html reply to test the `getCourseList` function
 2. Use right html page and wrong html page to test the `parseFirstLevelCurriculum` function
 3. Mock html reply test the `getFirstLevelCurriculum` function
 */
const LearnHelperUtil = require('../../app/thulib/learnhelper')
const learnHelper = new LearnHelperUtil('xxx', 'xxxx')
const nock = require('nock')
const readFile = require('fs-readfile-promise')

const assertCourses = (courses) => {
  courses.should.be.Array().and.should.not.be.empty()

  const course = courses[0]
  const properties = ['courseID', 'courseName', 'email', 'teacher', 'phone',
    'unreadNotice', 'newFile', 'unsubmittedOperations']

  course.should.have.properties(properties)

  course.courseID.should.match(/^\d{4}-\d{4}-[1-2]-\d+-\d+$/)

  course.unreadNotice.should.be.Number().and.aboveOrEqual(0)

  course.newFile.should.be.Number().and.aboveOrEqual(0)

  course.unsubmittedOperations.should.be.Number().and.aboveOrEqual(0)
}

const assertDocs = (docs) => {
  docs.should.be.Array().and.should.not.be.empty()

  const doc = docs[0]
  const properties = ['title', 'explanation', 'size', 'updatingTime', 'state',
    'size', 'url']

  doc.should.have.properties(properties)

  doc.updatingTime.should.be.Number().and.aboveOrEqual(0)

  doc.state.should.match(/previous|new|unknown/)
}

describe('Test for LearHelperUtil Class', () => {
  describe('1. test method "getCourseList"', function () {
    // avoid timeout error
    this.timeout(0)
    it('1.1 course list info should be returned', async () => {
      const response = await readFile(`${__dirname}\\test-list.html`)
      const outerDomain = 'https://learn.tsinghua.edu.cn'

      nock(outerDomain)
        .get('/MultiLanguage/lesson/student/MyCourse.jsp')
        .query((query) => {
          return ('language' in query)
        })
        .reply(200, response)

      const courseIDs = ['137928', '137929', '137930', '137931',
        '138765', '136965', '138767']

      courseIDs.forEach(async (ele, index) => {
        const response = await readFile(`${__dirname}\\test-info\\course-info-${index}.html`)
        nock(outerDomain)
          .get('/MultiLanguage/lesson/student/course_info.jsp')
          .query((query) => {
            return ('course_id' in query && query.course_id === courseIDs[index])
          })
          .reply(200, response)
      })

      const courses = await learnHelper.getCourseList()
      assertCourses(courses)
      // console.log('courses = ', courses)
    })
  })

  describe('1. test method "getDocuments"', function () {
    // avoid timeout error
    this.timeout(0)
    it('1.1 document info should be returned', async () => {
      const response = await readFile(`${__dirname}\\test-doc.html`)
      const outerDomain = 'https://learn.tsinghua.edu.cn'

      const courseID = '137928'

      nock(outerDomain)
        .get('/MultiLanguage/lesson/student/download.jsp')
        .query((query) => {
          return ('course_id' in query && query.course_id === courseID)
        })
        .reply(200, response)

      const docs = await learnHelper.getDocuments(courseID)
      assertDocs(docs)
      // console.log('docs = ', docs)
    })
  })

})
