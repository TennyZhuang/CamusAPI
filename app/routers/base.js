const auth = require('./auth')
const library = require('./library')
const learnhelper = require('./learnhelper')
const curriculum = require('./curriculum')

const initApp = (app) => {
  app.use(auth.router.routes()).use(auth.router.allowedMethods())
  app.use(library.router.routes()).use(library.router.allowedMethods())
  app.use(learnhelper.router.routes()).use(learnhelper.router.allowedMethods())
  app.use(curriculum.router.routes()).use(curriculum.router.allowedMethods())
}

exports.initApp = initApp
