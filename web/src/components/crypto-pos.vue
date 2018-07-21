<template>
<div>
  <p>Please send Bitcoin with the details below</p>
  <div v-if="order" class="section">
    <div class="tags has-addons">
      <span class="tag is-primary is-large">Amount:</span>
      <span class="tag is-info is-large">{{ order.amount }}</span>
    </div>
    <div class="tags has-addons">
      <span class="tag is-primary is-large">Address:</span>
      <span class="tag is-info is-large">{{ order.paymentAddress }}</span>
    </div>
    <div>
      <qrcode :value="encoding" :options="{ size: 250 }" />
    </div>
    <div v-if="state === 'waiting'">
      <span class="loader"></span>
      <span class="title is-5">Waiting for confirmation</span>
    </div>
    <div v-if="state === 'received'">
      <span class="title is-5">Payment Received, we will send your ebook once we have 3 confirmations</span>
    </div>
    <div v-if="state === 'error'">
      <span class="title is-5">An error occured, please contact support with order id {{ order._id }}</span>
    </div>
  </div>
</div>
</template>

<script>
import Orders from '@/api/orders'
import bip21 from 'bip21'
import socketio from 'socket.io-client'

export default {
  data() {
    return {
      order: null,
      socket: null,
      state: ''
    }
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  watch: {
    order() {
      if (this.order) {
        this.connect()
      }
    },
    socket() {
      this.socket.on('update', (data) => {
        this.handleUpdate(data)
      })
    }
  },
  async created() {
    this.order = await Orders.create(this.product)
  },
  computed: {
    encoding() {
      return bip21.encode(this.order.paymentAddress, {
        amount: this.order.amount,
        label: `Bitbooks ${this.order._id}`
      })
    }
  },
  methods: {
    connect() {
      const order = this.order._id
      const query = { order }
      const location = `${window.location.host}`
      this.socket = socketio(location, { resource: '/connect', query })
    },
    handleUpdate(data) {
      console.log(data)
      this.state = data.state
    }
  }
}
</script>
