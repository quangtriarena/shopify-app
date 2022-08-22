import Controller from './../../controller/store_setting.js'

<<<<<<< HEAD
export default function storeSettingRoute(app, Shopify) {
  app.get('/api/store-settings', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)

      const data = await StoreSettingMiddleware.getBySession(session)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })

  app.put('/api/store-settings', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)

      const storeSetting = await StoreSettingMiddleware.getByShop(session.shop)

      const { acceptedAt } = req.body

      const data = await StoreSettingMiddleware.update(storeSetting.id, { acceptedAt })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })
=======
export default function storeSettingRoute(app) {
  app.get('/api/store-settings', Controller.auth)
  app.put('/api/store-settings', Controller.update)
>>>>>>> 6763c1d62b0652973c3edeb3da9e6ddd815d9006
}
