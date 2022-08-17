import { Queue, Worker } from 'bullmq'
import BackgroundJobMiddleware from './background_job.js'
import DuplicatorExportMiddleware from './duplicator_export.js'
import DuplicatorImportMiddleware from './duplicator_import.js'
import DuplicatorPackageMiddleware from './duplicator_package.js'

let MyQueues = []

/**
 *
 * @param {String} queueName
 * @returns Object
 */
const createNewQueue = (queueName) => {
  const myQueue = new Queue(queueName, {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  })

  const worker = new Worker(
    queueName,
    async (job) => {
      console.log(`${queueName} ${job.data.__type} ${job.id} run`)

      console.log(`|---------------------------------------------------`)
      Object.keys(job.data)
        .filter((key) => !['fileContent'].includes(key))
        .forEach((key) => console.log(`| ${key}: ${job.data[key]}`))
      console.log(`|---------------------------------------------------`)

      try {
        switch (job.data.__type) {
          case 'duplicator_export':
            await DuplicatorExportMiddleware.create(job)
            break

          case 'duplicator_import':
            await DuplicatorImportMiddleware.create(job)
            break

          default:
            break
        }
      } catch (error) {
        console.log(`${queueName} ${job.data.__type} ${job.id} throw error: ${error.message}`)
      }
    },
    { concurrency: 1 },
  )

  worker.on('completed', async (job) => {
    console.log(`${queueName} ${job.data.__type} ${job.id} has completed`)

    // get backgroundJob
    let backgroundJob = await BackgroundJobMiddleware.findById(job.data.backgroundJobId)
    console.log('backgroundJob:')
    console.log(backgroundJob)

    // get duplicatorPackage
    if (backgroundJob.data.duplicatorPackageId) {
      let duplicatorPackage = await DuplicatorPackageMiddleware.findById(
        backgroundJob.data.duplicatorPackageId,
      )
      console.log('duplicatorPackage:')
      console.log(duplicatorPackage)
    }

    // remove job
    job.remove()
  })

  worker.on('failed', async (job, err) => {
    console.log(`${queueName} ${job.data.__type} ${job.id} has failed: ${err.message}`)

    // remove job
    job.remove()
  })

  worker.on('removed', async (job) => {
    console.log(`${queueName} ${job.data.__type} ${job.id} has removed`)
  })

  return myQueue
}

/**
 *
 * @param {Object} data
 * @returns Object
 */
const create = async (data) => {
  try {
    // create queue name
    let myQueue = null
    let queueName = data.shop.replace(/.myshopify.com/g, '__queue')
    for (let i = 0; i < MyQueues.length; i++) {
      if (MyQueues[i].name === queueName) {
        myQueue = MyQueues[i]
        break
      }
    }
    if (!myQueue) {
      myQueue = createNewQueue(queueName)
      MyQueues.push(myQueue)
    }

    // add job to queue
    let jobName = `${queueName}_${Date.now()}`
    let jobData = { ...data }
    let job = await myQueue.add(jobName, jobData)

    return { id: job.id, name: job.name }
  } catch (error) {
    throw error
  }
}

const BullmqJobMiddleware = { create }

export default BullmqJobMiddleware
