import verifyToken from '../../auth/verifyToken.js'
import ErrorCodes from '../../constants/errorCodes.js'
import ResponseHandler from '../../helpers/responseHandler.js'
import BackgroundJobMiddleware from '../../middlewares/background_job.js'

export default function backgroundJobRoute(app, Shopify) {
  app.get('/api/background-jobs', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const { page, limit } = req.query

      const data = await BackgroundJobMiddleware.find({ page, limit, shop })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })

  app.get('/api/background-jobs/:id', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const { id } = req.params

      const data = await BackgroundJobMiddleware.findById({ id })

      // check session
      if (data.shop !== shop) {
        throw new Error(ErrorCodes.NOT_PERMISSIONED)
      }

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })

  app.put('/api/background-jobs/:id', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const { id } = req.params

      const entry = await BackgroundJobMiddleware.findById({ id })

      // check session
      if (entry.shop !== shop) {
        throw new Error(ErrorCodes.NOT_PERMISSIONED)
      }

      const data = await BackgroundJobMiddleware.update({ id, data: req.body })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })

  app.delete('/api/background-jobs/:id', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const { id } = req.params

      const entry = await BackgroundJobMiddleware.findById(id)

      // check session
      if (entry.shop !== shop) {
        throw new Error(ErrorCodes.NOT_PERMISSIONED)
      }

      const data = await BackgroundJobMiddleware.delete(id)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })
}
