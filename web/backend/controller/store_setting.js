import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import StoreSettingMiddleware from '../middlewares/store_setting.js'

export default {
  auth: async (req, res) => {
    try {
      const session = await verifyToken(req, res)

      const data = await StoreSettingMiddleware.getBySession(session)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  update: async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)

      const { acceptedAt } = req.body

      let storeSetting = await StoreSettingMiddleware.getBySession(session)

      storeSetting = await StoreSettingMiddleware.update(storeSetting.id, { acceptedAt })

      return ResponseHandler.success(res, storeSetting)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
