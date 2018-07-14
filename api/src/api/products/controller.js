const Product = require('./model')
const request = require('request-promise')

exports.getProductDetails = async function(googleId) {
  const result = await request.get(
    `https://www.googleapis.com/books/v1/volumes/${googleId}`
  )
  return JSON.parse(result)
}

exports.getProducts = async function() {
  const products = await Product.find()
  const results = await Promise.all(products.map(async (product) => {
    try {
      const details = await this.getProductDetails(product.googleId)
      return {
        price: product.price,
        info: details.volumeInfo,
      }
    } catch (error) {
      console.log(error)
    }
  }))

  return results
}
