/**
 * Created by tianyizhuang on 07/12/2016.
 */

const errorHandler = async (ctx, next) => {
  ctx.body = ctx.body || {}

  try {
    await next()
    ctx.body.message = 'Success'
  } catch (e) {
    ctx.status = 400
    ctx.body.message = 'Failure'
    ctx.body.reason = e.message
  }
}

module.exports = errorHandler
