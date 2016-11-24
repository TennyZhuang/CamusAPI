const auth = require('./auth')

const initApp = (app) => {
  app.use(auth.router.routes()).use(auth.router.allowedMethods())
}

exports.initApp = initApp
