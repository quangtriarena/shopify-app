import randomProduct from '../mockup/products.js'
import BackgroundJobMiddleware from './background_job.js'
import ProductMiddleware from './product.js'
import ProductImageMiddleware from './product_image.js'
import StoreSettingMiddleware from './store_setting.js'

let LIMIT_PER_PROCESS = 5

const create = async (job) => {
  let { shop, backgroundJobId } = job.data

  let res = null
  let backgroundJob = null
  let storeSetting = null

  let resources = Array.from({ length: 20 })

  let result = {}

  try {
    // get background job
    backgroundJob = await BackgroundJobMiddleware.findById(backgroundJobId)

    // check background job is running
    if (!['PENDING', 'RUNNING'].includes(backgroundJob.status)) {
      console.log(`| <<< PROCESS HAS BEEN ${backgroundJob.status} >>>`)
      return
    }

    // update background job status
    if (backgroundJob.status === 'PENDING') {
      backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
        status: 'RUNNING',
      })
    }

    // get store setting
    storeSetting = await StoreSettingMiddleware.findOne({ shop })
    const { accessToken } = storeSetting

    // validate app plan

    // process
    for (let ii = 0, iiLeng = Math.ceil(resources.length / LIMIT_PER_PROCESS); ii < iiLeng; ii++) {
      console.log(`[${ii + 1}/${iiLeng}] run`)

      let _resources = resources.slice(ii * LIMIT_PER_PROCESS, (ii + 1) * LIMIT_PER_PROCESS)

      for (let i = 0, leng = _resources.length; i < leng; i++) {
        let productRandom = randomProduct()

        // create product
        let productCreated = await ProductMiddleware.create({
          shop,
          accessToken,
          data: { product: productRandom },
        })
          .then((res) => {
            console.log(`|\t[${i + 1}/${leng}] product created ${res.product.id}`)
            return res.product
          })
          .catch((err) => {
            console.log(`|t[${i + 1}/${leng}] create product failed: ${err.message}`)
          })

        if (productCreated && productRandom.images.length > 0) {
          let variantIds = productCreated.variants.map((item) => item.id)

          // create images
          for (let j = 0, jLeng = productRandom.images.length; j < jLeng; j++) {
            await ProductImageMiddleware.create({
              shop,
              accessToken,
              product_id: productCreated.id,
              data: {
                image: {
                  product_id: productCreated.id,
                  src: productRandom.images[j],
                  alt: productCreated.title,
                  variant_ids: [variantIds[Math.floor(Math.random() * variantIds.length)]],
                },
              },
            })
              .then((res) => {
                console.log(`|\t\t[${j + 1}/${jLeng}] image created ${res.image.id}`)
              })
              .catch((err) => {
                console.log(`|\t\t[${j + 1}/${jLeng}] create image failed: ${err.message}`)
              })
          }
        }
      }

      // update background job
      backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
        status: 'RUNNING',
        progress: Math.ceil(((ii + 1) / iiLeng) * 100),
      })

      console.log(`[${ii + 1}/${iiLeng}] completed`)
    }

    // update background job
    backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
      status: 'COMPLETED',
      progress: 100,
      result: result ? JSON.stringify(result) : null,
    })
  } catch (error) {
    // update background job
    backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
      status: 'FAILED',
      message: error.message,
    })

    throw error
  }
}

const PopulateMiddleware = { create }

export default PopulateMiddleware
