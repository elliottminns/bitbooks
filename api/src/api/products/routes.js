const controller = require('./controller')

exports.get = async function(ctx) {
  ctx.body = await controller.getProducts()
}

exports.routes = function(router) {
  router.get('/', this.get)
  return router
}
