import verifyToken from '../auth/verifyToken.js'
import ErrorCodes from '../constants/errorCodes.js'
import ResponseHandler from '../helpers/responseHandler.js'
import BackgroundJobMiddleware from '../middlewares/background_job.js'

export default {
  find: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const data = await BackgroundJobMiddleware.find({ ...req.query, shop })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  findById: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
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
  },

  update: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { id } = req.params

      const entry = await BackgroundJobMiddleware.findById(id)

      // check session
      if (entry.shop !== shop) {
        throw new Error(ErrorCodes.NOT_PERMISSIONED)
      }

      const data = await BackgroundJobMiddleware.update(id, req.body)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  delete: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
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
  },
}
