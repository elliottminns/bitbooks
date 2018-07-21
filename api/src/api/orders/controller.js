const Order = require('./model')
const Product = require('../products/model')
const request = require('request-promise-cache')
const bitcoin = require('bitcoinjs-lib')
const config = require('../../configuration')
const coinservice = require('../../coinservice')
const xpub = config.get('XPUB')
const isTestnet = config.get('TESTNET') === 'true'
const network = isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin

const root = bitcoin.bip32.fromBase58(xpub, bitcoin.networks.testnet)

async function getNewAddress() {
  const count = await Order.countDocuments()
  const node = root.derive(count)
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey, network }).address
}

async function getAmountForPrice(price) {
  const url = 'https://api.coindesk.com/v1/bpi/currentprice.json'
  const result = await request({
    url: url,
    cacheKey: url,
    cacheTTL: 15,
    cacheLimit: 24,
    resolveWithFullResponse: false
  })
  const response = JSON.parse(result)
  const rate = response["bpi"]["USD"]["rate_float"]
  return parseFloat(((price * 1e8) / (rate * 1e8)).toFixed(8))
}

exports.create = async function({ price, productId } = {}) {
  const product = await Product.findById(productId)
  if (!product) { throw new Error('Invalid productId') }

  const amount = await getAmountForPrice(price)

  const address = await getNewAddress()

  const order = await Order.create({
    paymentAddress: address,
    amount: amount,
    price: price,
    product: product
  })

  await coinservice.watchAddress({ address, order: order._id })

  return order
}
