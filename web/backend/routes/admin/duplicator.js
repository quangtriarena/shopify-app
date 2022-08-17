import verifyToken from '../../auth/verifyToken.js'
import MulterUpload from '../../connector/multer/index.js'
import ResponseHandler from '../../helpers/responseHandler.js'
import BullmqBackgroundJobMiddleware from '../../middlewares/bullmq_background_job.js'
import DuplicatoreMiddleware from '../../middlewares/duplicator.js'
import DuplicatorActions from '../../middlewares/duplicator_actions.js'
import DuplicatorPackageMiddleware from '../../middlewares/duplicator_package.js'

export default function duplicatorRoute(app, Shopify) {
  app.get('/api/duplicator-packages', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      let data = await DuplicatorPackageMiddleware.getAll(shop)

      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/duplicator-check-code error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  })

  app.post('/api/duplicator-check-code', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const { uuid } = req.body

      let data = await DuplicatoreMiddleware.checkCode({ shop, uuid })

      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/duplicator-check-code error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  })

  app.post('/api/duplicator-export', async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
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
  })

  app.post('/api/duplicator-import', MulterUpload.array('files', 20), async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
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
  })
}
