import verifyToken from '../../auth/verifyToken.js'
import ResponseHandler from '../../helpers/responseHandler.js'
import ProductMiddleware from '../../middlewares/product.js'
import StoreSettingMiddleware from '../../middlewares/store_setting.js'

export default function submitionRoute(app, Shopify) {
  app.get('/api/test-api', async (req, res) => {
    console.log('/api/test-api')
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      const result = {
        product: {
          title: 'Sleeveless Stripe Knit Top',
          tags: ['Barnes & Noble', 'Big Air', "John's Fav"],
          product_type: 'Sleeveless Stripe Knit Top',
          vendor: 'Sleeveless Stripe Knit Top',
          body_html: '<strong>Good snowboard!</strong>',
        },
      }

      const data = await ProductMiddleware.create({
        shop,
        accessToken,
        data: result,
      })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })
}
