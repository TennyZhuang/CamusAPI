const Koa = require('koa')
const logger = require('koa-logger')
const bodyParser = require('koa-better-body')
const routers = require('./routers/base')

const app = new Koa()

app.use(logger())
app.use(bodyParser())

routers.initApp(app)

app.listen(8000, () => {
  console.log('listen on 8000')
})
