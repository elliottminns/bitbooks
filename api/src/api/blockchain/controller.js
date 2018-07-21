const Transaction = require('../transactions/model')
const Order = require('../orders/model')
const coinservice = require('../../coinservice')
const config = require('../../configuration')
const confirmations = parseInt(config.get('CONFIRMATIONS_REQUIRED'))
const socket = require('../../socket')

exports.onTransaction = async function(txid) {
  const transaction = await Transaction.findOne({ txid })
  const tx = await coinservice.getTransaction(txid)

  console.log(tx)
  console.log(transaction)

  if (!transaction) {
    const status = tx.confirmations < confirmations ?
      'unconfirmed' : 'confirmed'

    const t = await Transaction.create({
      txid: txid,
      amount: tx.details[0].amount,
      address: tx.details[0].address,
      status: status
    })

    console.log(t)

    const order = await Order.findOne({ paymentAddress: t.address })

    console.log(order)
  
    if (order) {
      const room = socket.io.to(`${order._id}`)
      if (order.amount <= t.amount) {
        room.emit('update', { state: 'received' } )
      } else {
        room.emit('update', { state: 'error' })
      }
    }

  } else {

  }
}
