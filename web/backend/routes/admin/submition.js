import verifyToken from '../../auth/verifyToken.js'
import ResponseHandler from '../../helpers/responseHandler.js'
import DuplicatorActions from '../../middlewares/duplicator_actions.js'
import BullmqBackgroundJobMiddleware from '../../middlewares/bullmq_background_job.js'
import ProductMiddleware from '../../middlewares/product.js'
import fs from 'fs'

export default function submitionRoute(app, Shopify) {
  app.get('/api/submition', async (req, res) => {
    console.log('----------------------------------------')
    console.log('/api/submition')
    console.log('----------------------------------------')
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      let data = null

      let content = await fs.readFileSync('./temp/47ae3272afc321e12589b6fd77215f29')
      content = Buffer.from(content).toString('base64')

      let product = {}
      product.title = 'Burton Custom Freestyle 151'
      product.body_html = '<strong>Good snowboard!</strong>'
      product.vendor = 'Burton'
      product.product_type = 'Snowboard'
      product.images = [
        {
          attachment: content,
        },
      ]

      data = await ProductMiddleware.create({ shop, accessToken, data: { product } })

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
//         uuid: 'fb764dbf-0ca6-40fe-92fa-6724fcc712ae',
//         package: 9,
//       }

//       let data = null

//       data = await BullmqBackgroundJobMiddleware.create('duplicator_import', {
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

//       req.body = {
//         resources: [
//           { type: 'product', count: '10' },
//           { type: 'custom_collection', count: '10' },
//           { type: 'smart_collection', count: '10' },
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
