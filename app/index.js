const Koa = require('koa')
const logger = require('koa-logger')
const restc = require('restc')
const bodyParser = require('koa-better-body')
const routers = require('./routers/base')
const lowercase = require('./middlewares/lowercase').lowercase

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(restc.koa2())
app.use(lowercase)

routers.initApp(app)

app.listen(8000, () => {
  console.log('listen on 8000')
})
