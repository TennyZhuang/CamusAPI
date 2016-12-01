/**
 * Created by XiYe on 12/1/2016.
 */

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
    const parseFirstLevel =($) => {
      const coursesDict = {}
      $('.kc_div').each((i, elem) => {
        const course = {}
        course['courseid'] = 'id'
        course['coursename'] = $(elem).find('h5').first().children().first().text()
        course['time'] = '[[1-7,1-6]]'
        course['teacher'] = 'teacher'
        course['classroom'] = 'classroom'
        course['weeks'] = [1]
        courses[i] = course
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
