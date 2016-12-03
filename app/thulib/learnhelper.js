/* Created by Songzhou Yang */

const rp = require('request-promise')
const ci = require('cheerio')
const AuthUtil = require('./auth')


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

  async loginCic() {
    try {
      const ticket = await AuthUtil.getTicket(this.username, this.password, 'WLXT')
      const options = {
        uri: `${LearnHelperUtil.CIC_LOGIN_URL}${ticket}`,
        method: 'GET',
        jar: this.cookies
      }

      await rp(options)
    } catch (e) {
      // TODO: error handler
      console.error(e)
    }
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
      for (const ele of Array.from($('.info_tr, .info_tr2'))) {
        const $this = $(ele)
        const course = {}

        course.courseName = $this.find('a').text().trim()

        const url = $this.find('a').attr('href')
        if (url.indexOf('learn.cic.tsinghua.edu.cn') !== -1) {
          course.courseID = url.split('/').slice(-1)[0]
          course._courseID = course.courseID
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
          course.courseID = `2016-2017-1-${courseNum}-${courseSeq}`
          course._courseID = courseID
        }

        course.unsubmittedOperations = parseInt($this.find('.red_text').eq(0).text())
        course.unreadNotice = parseInt($this.find('.red_text').eq(1).text())
        course.newFile = parseInt($this.find('.red_text').eq(2).text())

        courses.push(course)
      }
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
        const updatingTime = $children.eq(4).text().replace(/&nbsp;/gi, '').trim()
        doc.updatingTime = new Date(`${updatingTime} 00:00:00`).getTime()
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
      for (const ele of Array.from($('.tr1, .tr2'))) {
        const $this = $(ele)
        const assignment = {}

        const $children = $this.children()
        assignment.title = $children.eq(0).text().replace(/&nbsp;/gi, '').trim()
        const startDate = $children.eq(1).text().replace(/&nbsp;/gi, '').trim()
        assignment.startDate = new Date(`${startDate} 00:00:00`).getTime()
        const dueDate = $children.eq(2).text().replace(/&nbsp;/gi, '').trim()
        assignment.dueDate = new Date(`${dueDate} 23:59:59`).getTime()
        assignment.state = $children.eq(3).text().replace(/&nbsp;/gi, '').trim()
        assignment.size = $children.eq(4).text().replace(/&nbsp;/gi, '').trim()

        const homeworkPrefix = 'http://learn.tsinghua.edu.cn/MultiLanguage/lesson/student/'
        const _url = $children.eq(0).find('a').attr('href')

        assignment.assignmentID = parseInt(_url.split(/&|=/).slice(-5)[0])
        const $1 = await rp({
          method: 'GET',
          uri: homeworkPrefix + _url,
          jar: this.cookies,
          transform: (body) => {
            return ci.load(body, {decodeEntities: false})
          }
        })
        assignment.detail = $1('#table_box .tr_2').eq(1).text().replace(/&nbsp;/gi, '').trim()
        assignment.filename = $1('#table_box .tr_2').eq(2).text().replace(/&nbsp;/gi, '').trim()
        assignment.fileURL = $1('#table_box .tr_2').eq(2).find('a').attr('href')
        assignment.fileURL = !assignment.fileURL ? '' : this.prefix + assignment.fileURL

        const $2 = await rp({
          method: 'GET',
          uri: homeworkPrefix + _url.replace('detail', 'view'),
          jar: this.cookies,
          transform: (body) => {
            return ci.load(body, {decodeEntities: false})
          }
        })
        assignment.evaluatingTeacher = $2('#table_box .tr_12').eq(0).text().replace(/&nbsp;/gi, '').trim()
        let evaluatingDate = $2('#table_box .tr_12').eq(1).text().replace(/&nbsp;/gi, '').trim()
        evaluatingDate = new Date(`${evaluatingDate} 00:00:00`).getTime()
        assignment.evaluatingDate = Number.isNaN(evaluatingDate) ? 0 : evaluatingDate
        assignment.scored = assignment.evaluatingDate !== 0
        assignment.grade = parseFloat($2('#table_box .tr_1').eq(2).text().replace('分', '0').trim())
        assignment.grade = isNaN(assignment.grade) ? 0.0 : assignment.grade
        assignment.comment = $2('#table_box .tr_12').eq(2).text().replace(/&nbsp;/gi, '').trim()

        assignments.push(assignment)
      }
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
          _publishTime,
          rawState] = tds.map(td => $(td).text().trim())
        const publishTime = new Date(`${_publishTime} 00:00:00`).getTime()

        const href = encodeURI(`${this.prefix}/MultiLanguage/public/bbs/${$(tds[1]).find('a').attr('href')}`)
        const options = {
          method: 'GET',
          uri: href,
          jar: this.cookies,
          transform: (body) => {
            return ci.load(body, {decodeEntities: false})
          }
        }

        const noticeID = parseInt(href.split(/&|=/).slice(-3)[0])
        const $notice = await rp(options)
        const content = $notice($notice('.tr_l2')[1]).text()

        const sequenceNum = parseInt(sequenceNumStr)
        const state = rawState === '已读' ? 'read' : 'unread'

        notices.push({
          noticeID,
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

LearnHelperUtil.CIC_HOST_URL = 'http://learn.cic.tsinghua.edu.cn'
LearnHelperUtil.CIC_LOGIN_URL = `${LearnHelperUtil.CIC_HOST_URL}/j_spring_security_thauth_roaming_entry?status=SUCCESS&ticket=`

module.exports = LearnHelperUtil
