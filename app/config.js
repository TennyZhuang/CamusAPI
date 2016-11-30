const process = require('process')

class Config {
  constructor () {
    this.debug = true
    this.production = false
    this.port = process.env.RUN_PORT || 8000
    this.mongodbUrl = 'mongodb://localhost:27017/camus'
  }
}

class DevelopmentConfig extends Config {
  constructor () {
    super()
  }
}

class ProductionConfig extends Config {
  constructor () {
    super()
    this.debug = false
    this.production = true
    this.mongodbUrl = 'mongodb://database:27017/camus'
  }
}

const configs = new Map([
  ['development', new DevelopmentConfig()],
  ['production', new ProductionConfig()]
])

exports.config = configs.get(process.env.NODE_ENV || 'development')
