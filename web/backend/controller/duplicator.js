import verifyToken from '../auth/verifyToken.js'
import ErrorCodes from '../constants/errorCodes.js'
import ResponseHandler from '../helpers/responseHandler.js'
import BullmqBackgroundJobMiddleware from '../middlewares/bullmq_background_job.js'
import DuplicatoreMiddleware from '../middlewares/duplicator.js'
import DuplicatorActions from '../middlewares/duplicator_actions.js'
import DuplicatorPackageMiddleware from '../middlewares/duplicator_package.js'
import StoreSettingMiddleware from '../middlewares/store_setting.js'

export default {
  update: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { id } = req.params

      let entry = await DuplicatorPackageMiddleware.findById(id)

      // check shop owner
      if (entry.shop !== shop) {
        throw new Error(ErrorCodes.NOT_PERMISSIONED)
      }

      let data = await DuplicatorPackageMiddleware.update(id, req.body)

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

      let entry = await DuplicatorPackageMiddleware.findById(id)

      // check shop owner
      if (entry.shop !== shop) {
        throw new Error(ErrorCodes.NOT_PERMISSIONED)
      }

      let data = await DuplicatorPackageMiddleware.delete(id)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  get: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = await DuplicatorPackageMiddleware.getAll(shop)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  getByDuplicator: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let storeSetting = await StoreSettingMiddleware.getByShop(shop)

      let duplicatorStore = await StoreSettingMiddleware.findByUuid(storeSetting.duplicator)

      let data = await DuplicatorPackageMiddleware.getAll(duplicatorStore.shop)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  checkCode: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { uuid } = req.body

      let data = await DuplicatoreMiddleware.checkCode({ shop, uuid })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  getDuplicatorStore: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let storeSetting = await StoreSettingMiddleware.getByShop(shop)

      let duplicatorStore = await StoreSettingMiddleware.findByUuid(storeSetting.duplicator)

      return ResponseHandler.success(res, duplicatorStore)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  export: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = await BullmqBackgroundJobMiddleware.create('duplicator_export', {
        ...req.body,
        shop,
      })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  import: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = await BullmqBackgroundJobMiddleware.create('duplicator_import', {
        ...req.body,
        shop,
      })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
