/**
 * Created by tianyizhuang on 07/12/2016.
 */

const rp = require('request-promise')
const ci = require('cheerio')
const AuthUtil = require('./auth')


class CicLearnHelperUtil {
  constructor(username, password) {
    this.cookies = rp.jar()
    this.username = username
    this.password = password
    this.prefix = 'http://learn.cic.tsinghua.edu.cn'
  }

  async login() {
    try {
      const ticket = await AuthUtil.getTicket(this.username, this.password, 'WLXT')
      const options = {
        uri: `${this.prefix}/j_spring_security_thauth_roaming_entry?status=SUCCESS&ticket=${ticket}`,
        method: 'GET',
        jar: this.cookies
      }

      await rp(options)
    } catch (e) {
      // TODO: error handler
      console.error(e)
    }
  }

  async getNotices(courseID) {
    const noticeUrl = `${this.prefix}/b/myCourse/notice/listForStudent/${courseID}?currentPage=1&pageSize=1000`
    const notices = []
    try {
      const res = await rp({
        method: 'GET',
        uri: noticeUrl,
        jar: this.cookies,
        json: true
      })

      for (const rawNoticeInfo of res.paginationList.recordList) {
        const notice = {}
        if (rawNoticeInfo.status) {
          notice.state = rawNoticeInfo.status.trim() === '1' ? 'read' : 'unread'
        } else {
          notice.state = 'unread'
        }
        const rawNotice = rawNoticeInfo.courseNotice
        notice.noticeID = rawNotice.id
        notice.title = rawNotice.title
        notice.publisher = rawNotice.owner
        notice.publishTime = new Date(`${rawNotice.regDate} 00:00:00`).getTime()

        const detailUrl = `${this.prefix}/b/myCourse/notice/studDetail/${notice.noticeID}`
        const det = await rp({
          method: 'GET',
          uri: detailUrl,
          jar: this.cookies,
          json: true
        })

        const _detail = ci.load(det.dataSingle.detail, {decodeEntities: false})
        notice.content = _detail.text()
        notices.push(notice)
      }

      return notices
    } catch (e) {
      console.error(e)
      return []
    }
  }
}

module.exports = CicLearnHelperUtil
