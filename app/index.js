const Koa = require('koa')
const logger = require('koa-logger')
const restc = require('restc')
const convert = require('koa-convert')
const bodyParser = require('koa-better-body')
const routers = require('./routers/base')
const lowercase = require('./middlewares/lowercase').lowercase
const db = require('./models/base')
const config = require('./config').config

const app = new Koa()

db.connect()

app.use(logger())
app.use(convert(bodyParser()))
app.use(restc.koa2())
app.use(lowercase)

routers.initApp(app)

app.listen(config.port, () => {
  console.log(`listen on ${config.port}`)
})
