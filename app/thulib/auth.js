const rp = require('request-promise')

class AuthUtil {
  static async getTicket(username, password) {
    const apiAddress = 'https://id.tsinghua.edu.cn/thuser/authapi/login'
    const loginUrl = `${apiAddress}/ALL_ZHJW/0_0_0_0`
    const option = {
      method: 'POST',
      uri: loginUrl,
      formData: {
        username: username,
        password: password
      }
    }
    const resp = JSON.parse(await rp.post(option))
    if (resp.status !== 'RESTLOGIN_OK') {
      throw new Error(resp.status)
    }

    return resp.ticket
  }

  static async auth(username, password) {
    try {
      await AuthUtil.getTicket(username, password)
      return true
    } catch (e) {
      return false
    }
  }
}

exports.AuthUtil = AuthUtil
