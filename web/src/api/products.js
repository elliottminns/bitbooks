import axios from 'axios'

export default {
  async get() {
    return axios.get('/api/products')
  }
}
