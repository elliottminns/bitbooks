import axios from 'axios'

export default {
  async create(product) {
    const data = {
      productId: product._id,
      price: product.price
    }
    return axios.post('/api/orders', data).then(r => r.data)
  }
}
