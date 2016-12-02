const process = require('process')

class Config {
  constructor () {
    this.debug = true
    this.production = false
    this.port = process.env.RUN_PORT || 8000
    this.mongodbUrl = 'mongodb://localhost:27017/camus'
    this.secretkey = process.env.SECRETKEY || 'camusapi'
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

class TestConfig extends Config {
  constructor () {
    super()
    this.mongodbUrl = 'mongodb://localhost:27017/camus-test'
  }
}

const configs = new Map([
  ['development', new DevelopmentConfig()],
  ['production', new ProductionConfig()],
  ['test', new TestConfig()]
])

module.exports = configs.get(process.env.NODE_ENV || 'development')
