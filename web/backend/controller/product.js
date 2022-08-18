import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import ProductMiddleware from '../middlewares/product.js'

export default {
  count: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const data = await ProductMiddleware.count({ shop, accessToken })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  find: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const data = await ProductMiddleware.find({ ...req.query, shop, accessToken })

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

      const data = await ProductMiddleware.findById({ shop, accessToken, id })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  create: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const data = await ProductMiddleware.create({ shop, accessToken, data: req.body })

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
  },

  delete: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { id } = req.params

      const data = await ProductMiddleware.delete({ shop, accessToken, id })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
