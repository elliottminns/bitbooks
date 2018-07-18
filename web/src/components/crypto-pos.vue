<template>
<div>
</div>
</template>

<script>
import Orders from '@/api/orders'
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
  }
}
</script>
