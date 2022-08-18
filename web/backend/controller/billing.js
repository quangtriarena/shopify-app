import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import BillingMiddleware from '../middlewares/billing.js'

export default {
  get: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const data = BillingMiddleware.getAppBillings()

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  create: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { id } = req.body

      const data = await BillingMiddleware.create({ shop, accessToken, id })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
