/**
 * Created by XiYe on 12/8/2016.
 */

const rp = require('request-promise').defaults({jar: true})
const sleep = require('es6-sleep').promise

const AuthUtil = require('../thulib/auth')
class ScheduleUtil {
  // static async getScheduleList(username, password, isUndergraduate) {
  //
  // }
  static getStartDate()
  {
    return '20161101'
  }
  static getEndDate()
  {
    return '20170201'
  }

  static async getWeekSchedule(username, password, isUndergraduate) {
    const prefix = 'http://zhjw.cic.tsinghua.edu.cn/jxmh.do'
    const startDate = ScheduleUtil.getStartDate();
    const endDate = ScheduleUtil.getEndDate();
    const scheduleUndergraduateArgs =
      `?m=bks_jxrl_all&p_start_date=${startDate}&p_end_date=${endDate}` +
      '\&jsoncallback=no_such_method'
    const scheduleGraduateArgs =
      `?m=yjs_jxrl_all&p_start_date=${startDate}&p_end_date=${endDate}`+
      '\&jsoncallback=no_such_method'
    const ticket = await AuthUtil.getTicket(username, password, 'ALL_ZHJW')
    await sleep(2000)
    const loginUrl =
      `http://zhjw.cic.tsinghua.edu.cn/j_acegi_login.do?ticket=${ticket}`
    const scheduleUrl = prefix +
      (isUndergraduate ? scheduleUndergraduateArgs: scheduleGraduateArgs)
    console.log(scheduleUrl)
    const cookies = rp.jar()
    const loginOptions = {
      method: 'GET',
      uri: loginUrl,
      jar: cookies
    }

    const scheduleOptions = {
      method: 'GET',
      uri: scheduleUrl,
      jar: cookies,
    }

    try {
      await rp(loginOptions)
      //Wait for ticket take effect
      const json = await rp(scheduleOptions)
      console.log(json)
    } catch (e) {
      throw e
    }
  }
}

module.exports = ScheduleUtil
