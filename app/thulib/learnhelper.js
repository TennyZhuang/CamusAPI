/* Created by Songzhou Yang */

const rp = require('request-promise')
const ci = require('cheerio')

class LearnHelperUtil {
  constructor(username, password) {
    this.username = username
    this.password = password
    this.j = rp.jar()
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
      jar: this.j
    })
  }

  async getCourseList() {
    try {
      const $ = await rp({
        method: 'GET',
        uri: `${this.prefix}/MultiLanguage/lesson/student/MyCourse.jsp?language=cn`,
        jar: this.j,
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
      console.log(courses)
      return {courses: courses}
    } catch (e) {
      throw e
    }
  }
}

module.exports = LearnHelperUtil
