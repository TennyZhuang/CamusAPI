const Koa = require('koa')
const logger = require('koa-logger')
const restc = require('restc')
const convert = require('koa-convert')
const bodyParser = require('koa-better-body')
const routers = require('./routers/base')
const lowercase = require('./middlewares/lowercase')
const db = require('./models/base')
const startTask = require('./tasks/start')
const config = require('./config')

const app = new Koa()

db.connect()
startTask()

app.use(logger())
app.use(convert(bodyParser()))
app.use(restc.koa2())
app.use(lowercase)

routers.initApp(app)

app.listen(config.port, () => {
  console.log(`listen on ${config.port}`)
})

module.exports = app
