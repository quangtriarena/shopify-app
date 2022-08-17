import verifyToken from '../../auth/verifyToken.js'
import MulterUpload from '../../connector/multer/index.js'
import ResponseHandler from '../../helpers/responseHandler.js'
import fs from 'fs'
import ProductImageMiddleware from '../../middlewares/product_image.js'

export default function uploadRoute(app, Shopify) {
  app.post('/api/upload', MulterUpload.array('images', 10), async (req, res) => {
    try {
      const session = await verifyToken(req, res, app, Shopify)
      const { shop, accessToken } = session

      let files = await new Promise((resolve, reject) => {
        let files = []
        let countTask = req.files.length

        for (let i = 0; i < req.files.length; i++) {
          files[i] = req.files[i]

          fs.readFile(req.files[i].path, { encoding: 'base64' }, (err, data) => {
            files[i].content = data

            // remove file temp
            fs.unlink(req.files[i].path, () => console.log(`Temp file removed`))

            countTask--

            if (countTask === 0) {
              resolve(files)
            }
          })
        }
      })

      const data = files

      console.log('data file admin', data)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  })
}
