/**
 * Created by tianyizhuang on 30/11/2016.
 */

const Router = require('koa-router')
const LibraryUtil = require('../thulib/library')

const router = new Router({
  prefix: '/library'
})

router.post('/hs', async (ctx) => {
  ctx.body = {
    message: 'Success',
    areas: LibraryUtil.result
  }
})

exports.router = router
