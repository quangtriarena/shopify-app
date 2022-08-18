import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'

export default {
  submit: async (req, res) => {
    console.log('----------------------------------------')
    console.log('/api/submition')
    console.log('----------------------------------------')
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = null

      /**
       * Duplicator export
       */
      // req.body = {
      //   resources: [
      //     { type: 'product', count: '10' },
      //     { type: 'custom_collection', count: '10' },
      //     { type: 'smart_collection', count: '10' },
      //   ],
      // }

      // data = await BullmqBackgroundJobMiddleware.create('duplicator_export', {
      //   ...req.body,
      //   shop,
      // })

      /**
       * Duplicator import
       */
      // req.body = {
      //   uuid: 'fb764dbf-0ca6-40fe-92fa-6724fcc712ae',
      //   package: 9,
      // }

      // data = await BullmqBackgroundJobMiddleware.create('duplicator_import', {
      //   ...req.body,
      //   shop,
      // })

      console.log('/api/submition data :>> ', data)

      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
