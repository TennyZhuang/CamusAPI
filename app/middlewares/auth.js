/**
 * Created by tianyizhuang on 22/12/2016.
 */

const ApiKey = require('../models/apikey')

const checkApiKey = async (ctx, next) => {
  const {apikey, apisecret} = ctx.request.fields || {}

  if (!apikey || !apisecret) {
    ctx.throw(401)
  }

  const apikeyObj = await ApiKey.findOne({key: apikey})

  if (!apikeyObj) {
    ctx.throw(401)
  }

  if (apisecret !== apikeyObj.secret) {
    ctx.throw(401)
  }

  await next()
}

module.exports = checkApiKey
