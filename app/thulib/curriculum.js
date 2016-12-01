/**
 * Created by XiYe on 12/1/2016.
 */
const rp = require('request-promise').defaults({jar: true})
const ci = require('cheerio')
const iconv = require('iconv-lite')

const AuthUtil = require('../thulib/auth')
class CurriculumUtil {
  static async getFirstLevelCurriculum(username, password) {
    const prefix = 'http://zhjw.cic.tsinghua.edu.cn/'
    // const curriculumUndergraduateFirstLevelUrl = `${prefix}/jxmh.do?m=bks_yjkbSearch`
    const curriculumUndergraduateFirstLevelUrlMobile = `${prefix}/portal3rd.do?m=bks_yjkbSearch&mobile=true`
    const ticket = await AuthUtil.getTicket(username, password, 'ALL_ZHJW')
    const loginUrl = `http://zhjw.cic.tsinghua.edu.cn/j_acegi_login.do?ticket=${ticket}`

    let j = rp.jar()
    const loginOptions = {
      method: 'GET',
      uri: loginUrl,
      jar: j
    }
    const curriculumOptions = {
      method: 'GET',
      uri: curriculumUndergraduateFirstLevelUrlMobile,
      jar: j,
      encoding: null,
      transform: function (body) {
        let html = iconv.decode(body, 'GBK')
        return ci.load(html, {decodeEntities: false})
      }
    }

    const parseWeekStr = (s) => {
      const range = (start, end, stride = 1) => {
        if (isNaN(start) || isNaN(end)) {
          throw "Unknown Curriculum Week Format Exception"
        }
        let x = []
        for (let i = start; i <= end; i += stride) {
          x.push(i)
        }
        return x
      }
      let week = null
      switch (s) {
        case "全周":
          week = range(1, 16)
          break
        case "前八周":
          week = range(1, 8)
          break
        case "后八周":
          week = range(9, 16)
          break
        case "单周":
          week = range(1, 16, 2)
          break
        case "双周":
          week = range(2, 16, 2)
          break
        default:
          let index = s.indexOf('-')
          while (index != -1) {
            week = week.concat(range(parseInt(s[index - 1]), parseInt(s[index + 1])))
            s = s.slice(index + 2, s.length)
            index = s.indexOf('-')
          }
          break
      }
      return week
    }

    const parseFirstLevelCurriculum =($) => {
      $('.kc_div').each((i, elem) => {
        const course = {}

        //Course ID and Time
        let classStr = $(elem).attr('class').split(" ")[1]
        let courseID = classStr.slice(2, classStr.length - 1)
        let time = [parseInt(classStr[0]), parseInt(classStr[1])]
        //Course Name
        let courseName = $(elem).find('h5').first().children().first().text()
        //Teacher
        let teacherStr = $(elem).find('h5').first().children().last().text()
        let teacher = teacherStr.slice(0, teacherStr.indexOf("&"))

        let li = $(elem).find('li').get(1)
        //Weeks
        let weekStr = $(li).find('span').first().text()
        weekStr = weekStr.slice(weekStr.indexOf('(') + 1, weekStr.indexOf(')'))
        let week = parseWeekStr(weekStr)

        //Classroom
        let classroom = $(li).find('span').last().text()

        course['coursename'] = courseName
        course['teacher'] = teacher
        course['courseid'] = courseID
        course['time'] = time
        course['classroom'] = classroom
        course['week'] = week
        console.log(course)
      })
    }
    const crawlCurriculum = () => {
      rp(curriculumOptions)
        .then(parseFirstLevel)
        .catch(
          () => {
            console.log('Crawl Curriculum failed')
          }
        )
    }

    rp(loginOptions)
      .then(
        (html) => {
          crawlCurriculum()
        }
      )
      .catch(
        () => {
          console.log('Login ALL_ZHJW failed')
        }
      )
  }
}

module.exports = CurriculumUtil
