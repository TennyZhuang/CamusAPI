const users = require('./users')
const library = require('./library')
const learnhelper = require('./learnhelper')
const curriculum = require('./curriculum')
const event = require('./event')
const current = require('./current')

const initApp = (app) => {
  app.use(users.router.routes()).use(users.router.allowedMethods())
  app.use(library.router.routes()).use(library.router.allowedMethods())
  app.use(learnhelper.router.routes()).use(learnhelper.router.allowedMethods())
  app.use(curriculum.router.routes()).use(curriculum.router.allowedMethods())
  app.use(event.router.routes()).use(event.router.allowedMethods())
  app.use(current.router.routes()).use(current.router.allowedMethods())
}

exports.initApp = initApp
