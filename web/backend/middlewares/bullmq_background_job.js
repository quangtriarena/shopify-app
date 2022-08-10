import BackgroundJobMiddleware from './background_job.js'
import BullmqJobMiddleware from './bullmq_job.js'

const create = async (__type, data) => {
  try {
    let res = null

    let _data = { ...data }

    if (_data.files) {
      _data.files = _data.files.map((item) => {
        let file = { ...item }

        delete file.content

        return file
      })
    }

    // create background job
    let backgroundJob = await BackgroundJobMiddleware.create({
      type: __type,
      shop: data.shop,
      data: JSON.stringify(_data),
    })

    // add job to queue
    const job = await BullmqJobMiddleware.create({
      __type,
      ...data,
      backgroundJobId: backgroundJob.id,
    })

    return { jobId: job.id, backgroundJobId: backgroundJob.id }
  } catch (error) {
    throw error
  }
}

const BullmqBackgroundJobMiddleware = { create }

export default BullmqBackgroundJobMiddleware
