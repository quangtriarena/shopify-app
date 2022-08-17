import BackgroundJobMiddleware from './background_job.js'
import BullmqJobMiddleware from './bullmq_job.js'
import DuplicatorPackageMiddleware from './duplicator_package.js'

const create = async (__type, data) => {
  try {
    let __data = { shop: data.shop }
    switch (__type) {
      case 'duplicator_export':
        // create duplicatorPackage
        let duplicatorPackage = await DuplicatorPackageMiddleware.create({
          shop: data.shop,
          data: JSON.stringify(data),
        })

        __data = { ...__data, duplicatorPackageId: duplicatorPackage.id }
        break

      case 'duplicator_import':
        __data = { ...__data, ...data }
        break

      default:
        break
    }

    // create backgroundJob
    let backgroundJob = await BackgroundJobMiddleware.create({
      type: __type,
      shop: data.shop,
      data: JSON.stringify(__data),
    })

    // add job to queue
    const job = await BullmqJobMiddleware.create({
      __type,
      shop: data.shop,
      backgroundJobId: backgroundJob.id,
    })

    return { jobId: job.id }
  } catch (error) {
    throw error
  }
}

const BullmqBackgroundJobMiddleware = { create }

export default BullmqBackgroundJobMiddleware
