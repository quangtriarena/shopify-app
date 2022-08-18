import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import BullmqBackgroundJobMiddleware from '../middlewares/bullmq_background_job.js'
import DuplicatorActions from '../middlewares/duplicator_actions.js'
import DuplicatorPackageMiddleware from '../middlewares/duplicator_package.js'

export default {
  get: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = await DuplicatorPackageMiddleware.getAll(shop)

      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/duplicator-check-code error :>> ', error.message)
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
      console.log('/api/duplicator-check-code error :>> ', error.message)
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
      console.log('/api/duplicator-export error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },

  import: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      console.log('req.files :>> ', req.files)

      const { files } = await DuplicatorActions.handleImportFile(req.files[0].path)

      console.log(`Import files:`)
      console.log(files.map((file) => file.name))

      let data = await BullmqBackgroundJobMiddleware.create('duplicator_import', { shop, files })

      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/duplicator-import error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
