/* Test flow
 Test 3 class functions
 1. Mock html reply to test `getCourseList` function
 2. Mock html reply to test `getDocuments` function
 3. Mock html reply to test `getAssignments` function
 */
const LearnHelperUtil = require('../../app/thulib/learnhelper')
const learnHelper = new LearnHelperUtil('xxx', 'xxxx')
const nock = require('nock')
const readFile = require('fs-readfile-promise')
const sleep = require('es6-sleep').promise

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

  doc.state.should.match(/new|previous|unknown/)
}

const assertAssignments = (assignments) => {
  assignments.should.be.Array().and.should.not.be.empty()

  const assignment = assignments[0]
  
  const properties = ['title', 'startDate', 'dueDate', 'state', 'size', 'assignmentID', 'detail', 'filename', 'fileURL', 
    'evaluatingTeacher', 'evaluatingDate', 'scored', 'grade', 'comment']

  assignment.should.have.properties(properties)

  assignment.startDate.should.be.Number().and.aboveOrEqual(0)
  assignment.dueDate.should.be.Number().and.aboveOrEqual(0)
  assignment.evaluatingDate.should.be.Number().and.aboveOrEqual(0)

  assignment.state.should.match(/已经提交|尚未提交/)
  assignment.scored.should.be.Boolean()
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
        const response = await readFile(`${__dirname}\\test-course-info\\course-info-${index}.html`)
        nock(outerDomain)
          .get('/MultiLanguage/lesson/student/course_info.jsp')
          .query((query) => {
            return (query.course_id === courseIDs[index])
          })
          .reply(200, response)
      })
      
      await sleep(2000)
      
      const courses = await learnHelper.getCourseList()
      assertCourses(courses)
      // console.log('courses = ', courses)
    })
  })
  
  describe('2. test method "getDocuments"', function () {
    // avoid timeout error
    this.timeout(0)
    it('1.1 document info should be returned', async () => {
      const response = await readFile(`${__dirname}\\test-doc.html`)
      const outerDomain = 'https://learn.tsinghua.edu.cn'

      const courseID = '137928'

      nock(outerDomain)
        .get('/MultiLanguage/lesson/student/download.jsp')
        .query((query) => {
          return (query.course_id === courseID)
        })
        .reply(200, response)


      const docs = await learnHelper.getDocuments(courseID)
      assertDocs(docs)
      // console.log('docs = ', docs)
    })
  })
  
  describe('3. test method "getAssignments"', function () {
    // avoid timeout error
    this.timeout(0)
    it('3.1 assignment info should be returned', async () => {
      const response = await readFile(`${__dirname}\\test-assignment.html`)
      const outerDomain = 'https://learn.tsinghua.edu.cn'

      const courseID = '137928'

      const assignmentIDs = ['714167', '715467', '710921', '718565', '721805', '726511', '718619',
        '718621', '725765', '725767', '728273']

      const recIDs = ['null', '4695237', '4695860', '4752631', '4755578', '4773263', '4881717',
        '4732442', '4730977', '4811077', '4829496']

      nock(outerDomain)
        .get('/MultiLanguage/lesson/student/hom_wk_brw.jsp')
        .query((query) => {
          return (query.course_id === courseID)
        })
        .reply(200, response)
      

      assignmentIDs.forEach(async (ele, index) => {
        const responseDetail = await readFile(`${__dirname}\\test-assignment-info\\assignment-detail-${index}.html`)
        const responseView = await readFile(`${__dirname}\\test-assignment-info\\assignment-view-${index}.html`)
        
        nock('http://learn.tsinghua.edu.cn')
          .get('/MultiLanguage/lesson/student/hom_wk_detail.jsp')
          .query((query) => {
            return (query.course_id === courseID && query.id === ele && query.rec_id === recIDs[index])
          })
          .reply(200, responseDetail)
        
        nock('http://learn.tsinghua.edu.cn')
          .get('/MultiLanguage/lesson/student/hom_wk_view.jsp')
          .query((query) => {
            return (query.course_id === courseID && query.id === ele && query.rec_id === recIDs[index])
          })
          .reply(200, responseView)
      })
      
      await sleep(2000)
      const assignments = await learnHelper.getAssignments(courseID)
      assertAssignments(assignments)
      // console.log('assignments = ', assignments)
    })
  })
})
