const auth = require('./auth')
const library = require('./library')

const initApp = (app) => {
  app.use(auth.router.routes()).use(auth.router.allowedMethods())
  app.use(library.router.routes()).use(library.router.allowedMethods())
}

exports.initApp = initApp
