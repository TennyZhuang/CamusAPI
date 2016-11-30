const rp = require('request-promise')
const ci = require('cheerio')

class LearnHelper {
  static async getCourseList(username, password) {
    const prefix = 'https://learn.tsinghua.edu.cn'
    const loginUrl = `${prefix}/MultiLanguage/lesson/teacher/loginteacher.jsp`
    const options = {
      method: 'POST',
      uri: loginUrl,
      form: {
        userName: username,
        password: password
      },
      transform: function (body) {
        return ci.load(body)
      }
    }
    rp(options).then(($) => {
      console.log($('.test'))
    })
  }
}

module.exports = LearnHelper
