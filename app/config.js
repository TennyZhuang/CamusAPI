const process = require('process')

class Config {
  constructor () {
    this.debug = true
    this.production = false
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
  }
}

const configs = new Map([
  ['development', new DevelopmentConfig()],
  ['production', new ProductionConfig()]
])

exports.config = configs.get(process.env.CAMUS_API_ENV || 'development')
