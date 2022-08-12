import BackgroundJobMiddleware from './background_job.js'
import BullmqJobMiddleware from './bullmq_job.js'
import DuplicatorPackageMiddleware from './duplicator_package.js'

const create = async (__type, data) => {
  try {
    let res = null

    // create backgroundJob
    let backgroundJob = await BackgroundJobMiddleware.create({
      type: __type,
      shop: data.shop,
      data: JSON.stringify(data),
    })

    // create duplicatorPackage
    let duplicatorPackage = null
    if (__type === 'duplicator_export') {
      duplicatorPackage = await DuplicatorPackageMiddleware.create({
        shop: data.shop,
        data: JSON.stringify(data),
      })
    }

    // add job to queue
    const job = await BullmqJobMiddleware.create({
      __type,
      ...data,
      backgroundJobId: backgroundJob.id,
      duplicatorPackageId: duplicatorPackage?.id || null,
    })

    return {
      jobId: job.id,
      backgroundJobId: backgroundJob.id,
      duplicatorPackageId: duplicatorPackage?.id || null,
    }
  } catch (error) {
    throw error
  }
}

const BullmqBackgroundJobMiddleware = { create }

export default BullmqBackgroundJobMiddleware
