/* Created by Songzhou Yang */

const rp = require('request-promise')
const ci = require('cheerio')

class LearnHelperUtil {
  constructor(username, password) {
    this.username = username
    this.password = password
    this.cookies = rp.jar()
    this.prefix = 'https://learn.tsinghua.edu.cn'
  }

  async login() {
    await rp({
      method: 'POST',
      uri: `${this.prefix}/MultiLanguage/lesson/teacher/loginteacher.jsp`,
      form: {
        userid: this.username,
        userpass: this.password
      },
      jar: this.cookies
    })
  }

  async getCourseList() {
    try {
      const $ = await rp({
        method: 'GET',
        uri: `${this.prefix}/MultiLanguage/lesson/student/MyCourse.jsp?language=cn`,
        jar: this.cookies,
        transform: (body) => {
          return ci.load(body, {decodeEntities: false})
        }
      })

      const courses = []
      $('.info_tr, .info_tr2').each(async(i, ele) => {
        const $this = $(ele)
        const course = {}

        course.coursename = $this.find('a').text().trim()

        const url = $this.find('a').attr('href')
        if (url.indexOf('learn.cic.tsinghua.edu.cn') !== -1) {
          course.courseid = url.split('/').slice(-1)[0]
        } else {
          const courseID = url.split('=').slice(-1)[0]
          const _$ = await rp({
            method: 'GET',
            uri: `${this.prefix}/MultiLanguage/lesson/student/course_info.jsp?course_id=${courseID}`,
            jar: this.cookies,
            transform: (body) => {
              return ci.load(body, {decodeEntities: false})
            }
          })
          const courseNum = _$('#table_box .tr_1').eq(0).text().trim()
          const courseSeq = _$('#table_box .tr_1').eq(1).text().trim()
          course.courseid = `2016-2017-1-${courseNum}-${courseSeq}`
        }

        course.unsubmittedoperations = parseInt($this.find('.red_text').eq(0).text())
        course.unreadnotice = parseInt($this.find('.red_text').eq(1).text())
        course.newfile = parseInt($this.find('.red_text').eq(2).text())

        courses[i] = course
      })
      return courses
    } catch (e) {
      throw e
    }
  }

  async getDocuments(courseID) {
    try {
      const $ = await rp({
        method: 'GET',
        uri: `${this.prefix}/MultiLanguage/lesson/student/download.jsp?course_id=${courseID}`,
        jar: this.cookies,
        transform: (body) => {
          return ci.load(body, {decodeEntities: false})
        }
      })

      const docs = []
      $('.tr1, .tr2').each((i, ele) => {
        const $this = $(ele)
        const doc = {}

        const $children = $this.children()
        doc.sequenceNum = $children.eq(0).text().replace(/&nbsp;/gi, '').trim()
        doc.title = $children.eq(1).text().replace(/&nbsp;/gi, '').trim()
        doc.explanation = $children.eq(2).text().replace(/&nbsp;/gi, '').trim()
        doc.size = $children.eq(3).text().replace(/&nbsp;/gi, '').trim()
        doc.updatingTime = $children.eq(4).text().replace(/&nbsp;/gi, '').trim()
        doc.state = $children.eq(5).text().replace(/&nbsp;/gi, '').trim()

        doc.url = this.prefix + $this.find('a').attr('href')

        doc.state = doc.state !== '' ? 'new' : 'previous'

        docs[i] = doc
      })
      return docs
    } catch (e) {
      throw e
    }
  }

  async getAssignments(courseID) {
    try {
      const $ = await rp({
        method: 'GET',
        uri: `${this.prefix}/MultiLanguage/lesson/student/hom_wk_brw.jsp?course_id=${courseID}`,
        jar: this.cookies,
        transform: (body) => {
          return ci.load(body, {decodeEntities: false})
        }
      })

      const assignments = []
      $('.tr1, .tr2').each(async(i, ele) => {
        const $this = $(ele)
        const assignment = {}

        const $children = $this.children()
        assignment.title = $children.eq(0).text().replace(/&nbsp;/gi, '').trim()
        assignment.startDate = $children.eq(1).text().replace(/&nbsp;/gi, '').trim()
        assignment.dueDate = $children.eq(2).text().replace(/&nbsp;/gi, '').trim()
        assignment.state = $children.eq(3).text().replace(/&nbsp;/gi, '').trim()
        assignment.size = $children.eq(4).text().replace(/&nbsp;/gi, '').trim()

        const homeworkPrefix = 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/'
        const _url = $children.eq(0).find('a').attr('href')

        const detailURL = homeworkPrefix + _url
        const $1 = await rp({
          method: 'GET',
          uri: detailURL,
          jar: this.cookies,
          transform: (body) => {
            return ci.load(body, {decodeEntities: false})
          }
        })
        assignment.detail = $1('#table_box .tr_2').eq(1).text().replace(/&nbsp;/gi, '').trim()
        assignment.filename = $1('#table_box .tr_2').eq(2).text().replace(/&nbsp;/gi, '').trim()
        assignment.fileURL = $1('#table_box .tr_2').eq(2).find('a').attr('href')
        assignment.fileURL = !assignment.fileURL ? '' : this.prefix + assignment.fileURL

        const reviewURL = homeworkPrefix + _url.replace('detail', 'view')
        const $2 = await rp({
          method: 'GET',
          uri: reviewURL,
          jar: this.cookies,
          transform: (body) => {
            return ci.load(body, {decodeEntities: false})
          }
        })
        assignment.evaluatingTeacher = $2('#table_box .tr_12').eq(0).text().replace(/&nbsp;/gi, '').trim()
        assignment.evaluatingDate = $2('#table_box .tr_12').eq(1).text().replace(/&nbsp;/gi, '').trim()
        assignment.evaluatingDate = assignment.evaluatingDate === 'null' ? '' : assignment.evaluatingDate
        assignment.scored = assignment.evaluatingDate !== ''
        assignment.grade = parseFloat($2('#table_box .tr_1').eq(2).text().replace('分', '0').trim())
        assignment.comment = $2('#table_box .tr_12').eq(2).text().replace(/&nbsp;/gi, '').trim()

        assignments[i] = assignment
      })
      return assignments
    } catch (e) {
      throw e
    }
  }

  async getNotices(courseID) {
    const noticeUrl = `${this.prefix}/MultiLanguage/public/bbs/getnoteid_student.jsp?course_id=${courseID}`

    const notices = []

    try {
      const option = {
        uri: noticeUrl,
        jar: this.cookies,
        transform: (body) => {
          return ci.load(body, {decodeEntities: false})
        }
      }

      const $ = await rp(option)

      for (const ele of Array.from($('.tr1, .tr2'))) {
        const tds = Array.from($(ele).find('td'))
        const [
          sequenceNumStr,
          title,
          publisher,
          publishTime,
          rawState] = tds.map(td => $(td).text().trim())

        const href = encodeURI(`${this.prefix}/MultiLanguage/public/bbs/${$(tds[1]).find('a').attr('href')}`)
        const options = {
          method: 'GET',
          uri: href,
          jar: this.cookies,
          transform: (body) => {
            return ci.load(body, {decodeEntities: false})
          }
        }

        const $notice = await rp(options)
        const content = $notice($notice('.tr_l2')[1]).text()

        const sequenceNum = parseInt(sequenceNumStr)
        const state = rawState === '已读' ? 'read' : 'unread'

        notices.push({
          sequenceNum,
          title,
          publisher,
          publishTime,
          state,
          content
        })
      }
    } catch (e) {
      console.error(e)
    }

    return notices
  }
}

module.exports = LearnHelperUtil
