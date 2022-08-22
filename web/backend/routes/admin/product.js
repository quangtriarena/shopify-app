import Controller from './../../controller/product.js'

<<<<<<< HEAD
export default function productRoute(app, Shopify) {
  app.get('/api/products/count', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const data = await ProductMiddleware.count({ shop, accessToken })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })

  app.get('/api/products', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const { limit, pageInfo, order } = req.query

      const data = await ProductMiddleware.find({ shop, accessToken, limit, pageInfo, order })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })

  app.get('/api/products/:id', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const { id } = req.params

      const data = await ProductMiddleware.findById({ shop, accessToken, id })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })

  app.post('/api/products', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      let data = await ProductMiddleware.create({ shop, accessToken, data: req.body })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })

  app.put('/api/products/:id', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const { id } = req.params

      const data = await ProductMiddleware.update({
        shop,
        accessToken,
        id,
        data: req.body,
      })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })

  app.delete('/api/products/:id', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const { id } = req.params

      const data = await ProductMiddleware.delete({ shop, accessToken, id })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })
=======
export default function productRoute(app) {
  app.get('/api/products/count', Controller.count)
  app.get('/api/products', Controller.find)
  app.get('/api/products/:id', Controller.findById)
  app.post('/api/products', Controller.create)
  app.put('/api/products/:id', Controller.update)
  app.delete('/api/products/:id', Controller.delete)
>>>>>>> 6763c1d62b0652973c3edeb3da9e6ddd815d9006
}
