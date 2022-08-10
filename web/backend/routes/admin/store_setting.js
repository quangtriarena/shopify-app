import verifyToken from '../../auth/verifyToken.js'
import ResponseHandler from '../../helpers/responseHandler.js'
import StoreSettingMiddleware from '../../middlewares/store_setting.js'

const TEST_STORES = ['haloha-shop.myshopify.com', 'electro-5-demo.myshopify.com']

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

      const testStore = TEST_STORES.includes(session.shop)

      const data = await StoreSettingMiddleware.update(storeSetting.id, { acceptedAt, testStore })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })
}
