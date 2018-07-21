const jayson = require('jayson/promise')
const Url = require('url')

class RPC {
  constructor({ url, port, user, password }) {
    this.port = port
    this.user = user
    this.password = password
    this.url = url
    const auth = new Buffer(`${this.user}:${this.password}`).toString('base64')
    const parts = Url.parse(url)
    this.client = jayson.client.http({
      host: url,
      port: this.port,
      headers: {
        'Authorization': `Basic ${auth}`
      }
    })
  }

  async request(method, params) {
    return this.client.request(method, params)
  }
}

module.exports = RPC
