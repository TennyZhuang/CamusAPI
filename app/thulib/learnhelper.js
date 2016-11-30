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
      $('.info_tr, .info_tr2').each((i, ele) => {
        const $this = $(ele)
        const course = {}

        course['coursename'] = $this.find('a').text().trim()

        const url = $this.find('a').attr('href')
        if (url.indexOf('learn.cic.tsinghua.edu.cn') !== -1) {
          course['courseid'] = url.split('-').slice(-2).join('-')
        } else {
          course['courseid'] = url.split('=').slice(-1)[0]
        }

        const infos = ['unsubmittedoperations', 'unreadnotice', 'newfile']
        $this.find('.red_text').each((i, ele) => {
          course[infos[i]] = parseInt($(ele).text())
        })

        courses[i] = course
      })
      return courses
    } catch (e) {
      throw e
    }
  }

  async getFiles(courseID) {
    try {
      const $ = await rp({
        method: 'GET',
        uri: `${this.prefix}/MultiLanguage/lesson/student/download.jsp?course_id=${courseID}`,
        jar: this.cookies,
        transform: (body) => {
          return ci.load(body, {decodeEntities: false})
        }
      })

      const files = []
      $('.tr1, .tr2').each((i, ele) => {
        const $this = $(ele)
        const file = {}

        const infos = ['sequenceNum', 'title', 'explanation', 'size', 'updatingTime', 'state']
        $this.children().each((i, ele) => {
          file[infos[i]] = $(ele).text().replace(/&nbsp;/gi, '').trim()
        })

        file.url = this.prefix + $this.find('a').attr('href')

        file.state = file.state !== '' ? 'new' : 'previous'

        console.log(file)
        files[i] = file
      })
      return files
    } catch (e) {
      throw e
    }
  }
}

module.exports = LearnHelperUtil
