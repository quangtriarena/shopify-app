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

      req.body = {
        uuid: '30c6e80b-a334-482a-9a74-0f5d048d3fdd',
        package: 5,
      }

      let data = null

      data = await BullmqBackgroundJobMiddleware.create('duplicator_import', {
        ...req.body,
        shop,
      })

      console.log('/api/submition data :>> ', data)

      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  })
}

// export default function submitionRoute(app, Shopify) {
//   app.get('/api/submition', async (req, res) => {
//     console.log('----------------------------------------')
//     console.log('/api/submition')
//     console.log('----------------------------------------')
//     try {
//       const session = await verifyToken(req, res, app, Shopify)
//       const { shop, accessToken } = session

//       req.body = {
//         resources: [
//           { type: 'products', count: 5 },
//           { type: 'custom_collection', count: 5 },
//           { type: 'smart_collection', count: 5 },
//         ],
//       }

//       let data = null

//       data = await BullmqBackgroundJobMiddleware.create('duplicator_export', {
//         ...req.body,
//         shop,
//       })

//       console.log('/api/submition data :>> ', data)

//       return ResponseHandler.success(res, data)
//     } catch (error) {
//       console.log('/api/submition error :>> ', error.message)
//       return ResponseHandler.error(res, error)
//     }
//   })
// }

// export default function submitionRoute(app, Shopify) {
//   app.get('/api/submition', async (req, res) => {
//     console.log('----------------------------------------')
//     console.log('/api/submition')
//     console.log('----------------------------------------')
//     try {
//       const session = await verifyToken(req, res, app, Shopify)
//       const { shop, accessToken } = session

//       let data = null

//       let url =
//         'https://arena-installation-new.s3.amazonaws.com/package_haloha-shop_20220810100321768.zip'

//       const { files } = await DuplicatorActions.downloadAndUnzipFile(url)

//       console.log(`Import files:`)
//       console.log(files.map((file) => file.name))

//       // console.log('/api/submition data :>> ', data)

//       data = await BullmqBackgroundJobMiddleware.create('duplicator_import', { shop, files })

//       return ResponseHandler.success(res, data)
//     } catch (error) {
//       console.log('/api/submition error :>> ', error.message)
//       return ResponseHandler.error(res, error)
//     }
//   })
// }
