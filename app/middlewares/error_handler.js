/**
 * Created by tianyizhuang on 07/12/2016.
 */

const errorHandler = async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 200) {
      ctx.body = ctx.body || {}
      ctx.body.message = 'Success'
    }
  } catch (e) {
    ctx.status = 400
    ctx.body = ctx.body || {}
    ctx.body.message = 'Failure'
    ctx.body.reason = e.message
  }
}

module.exports = errorHandler
