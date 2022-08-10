import verifyToken from '../../auth/verifyToken.js'
import ResponseHandler from '../../helpers/responseHandler.js'
import DuplicatorActions from '../../middlewares/duplicator_actions.js'
import BullmqBackgroundJobMiddleware from '../../middlewares/bullmq_background_job.js'

export default function submitionRoute(app, Shopify) {
  app.get('/api/submition', async (req, res) => {
    console.log('----------------------------------------')
    console.log('/api/submition')
    console.log('----------------------------------------')
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      let data = null

      let url =
        'https://arena-installation-new.s3.amazonaws.com/package_haloha-shop_20220810100321768.zip'

      const { files } = await DuplicatorActions.downloadAndUnzipFile(url)

      console.log(`Import files:`)
      console.log(files.map((file) => file.name))

      // console.log('/api/submition data :>> ', data)

      data = await BullmqBackgroundJobMiddleware.create('duplicator_import', { shop, files })

      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  })
}
