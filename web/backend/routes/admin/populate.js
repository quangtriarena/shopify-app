import verifyToken from '../../auth/verifyToken.js'
import ResponseHandler from '../../helpers/responseHandler.js'
import BullmqBackgroundJobMiddleware from '../../middlewares/bullmq_background_job.js'

export default function pupolateRoute(app, Shopify) {
  app.post('/api/pupolate', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const data = await BullmqBackgroundJobMiddleware.create('populate', { shop })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })
}
