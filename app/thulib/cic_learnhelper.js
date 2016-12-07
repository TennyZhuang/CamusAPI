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

        if (det.dataSingle) {
          const _detail = ci.load(det.dataSingle.detail, {decodeEntities: false})
          notice.content = _detail.text()
        } else {
          notice.content = ''
        }
        notices.push(notice)
      }

      return notices
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async getAssignments(courseID) {
    const assignmentUrl = `${this.prefix}/b/myCourse/homework/list4Student/${courseID}/0`
    const assignments = []
    try {
      const res = await rp({
        method: 'GET',
        uri: assignmentUrl,
        jar: this.cookies,
        json: true
      })

      for (const rawAssignment of res.resultList) {
        const assignment = {}
        const info = rawAssignment.courseHomeworkInfo
        const record = rawAssignment.courseHomeworkRecord

        assignment.assignmentID = info.homewkId ? info.homewkId : ''
        assignment.title = info.title ? info.title : ''
        assignment.startDate = info.beginDate ? info.beginDate : 0
        assignment.dueDate = info.endDate ? info.endDate : 0
        if (info.detail) {
          const _detail = ci.load(info.detail, {decodeEntities: false})
          assignment.detail = _detail.text()
        } else {
          assignment.detail = ''
        }
        assignment.state = record.status === '0' ? '尚未提交' : '已经提交'

        assignment.fileUrl = info.homewkAffix ? info.homewkAffix : ''
        assignment.filename = info.homewkAffixFilename ? info.homewkAffixFilename : ''
        assignment.size = '0' // TODO: parse size

        assignment.scored = record.status === '3'
        assignment.grade = record.mark ? record.mark : 0
        if (record.replyDetail) {
          const _comment = ci.load(record.replyDetail, {decodeEntities: false})
          assignment.comment = _comment.text()
        } else {
          assignment.comment = ''
        }
        assignment.evaluatingTeacher = record.gradeUser ? record.gradeUser : ''
        assignment.evaluatingDate = record.replyDate ? record.replyDate : 0

        assignments.push(assignment)
      }
      return assignments
    } catch (e) {
      console.error(e)
      return []
    }
  }
}

module.exports = CicLearnHelperUtil
