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
    <qrcode :value="encoding" :options="{ size: 250 }" />
  </div>
</div>
</template>

<script>
import Orders from '@/api/orders'
import bip21 from 'bip21'

export default {
  data() {
    return {
      order: null
    }
  },
  props: {
    product: {
      type: Object,
      required: true
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
  }
}
</script>
