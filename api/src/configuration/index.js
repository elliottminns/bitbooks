const config = require('../config')
const secrets = require('../../../secrets.json') || { env: {} }

exports.get = key => {
  return process.env[key] || secrets.env[key] || config.env[key]
}

exports.secret = key => {
  return process.env[key] || secrets.env[key]
}
