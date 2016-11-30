/* Created by Songzhou Yang */

const rp = require('request-promise')
const ci = require('cheerio')

class LearnHelperUtil {
  static async getCourseList(username, password) {
    try {
      const prefix = 'https://learn.tsinghua.edu.cn'
      const loginUrl = `${prefix}/MultiLanguage/lesson/teacher/loginteacher.jsp`
      const j = rp.jar()

      await rp({
        method: 'POST',
        uri: loginUrl,
        form: {
          userid: username,
          userpass: password
        },
        jar: j
      })

      const $ = await rp({
        method: 'GET',
        uri: `${prefix}/MultiLanguage/lesson/student/MyCourse.jsp?language=cn`,
        jar: j,
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
