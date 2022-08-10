import BackgroundJobMiddleware from './background_job.js'
import StoreSettingMiddleware from './store_setting.js'
import DuplicatorActions from './duplicator_actions.js'
import ProductMiddleware from './product.js'
import csvtojson from 'csvtojson'

const LIMIT_PER_PROCESS = 100

const create = async (job) => {
  const { shop, backgroundJobId } = job.data

  let res = null
  let backgroundJob = null
  let storeSetting = null

  let result = []

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
    storeSetting = await StoreSettingMiddleware.getByShop(shop)
    const { accessToken } = storeSetting

    // validate app plan

    // process
    for (let ii = 0, iiLeng = job.data.files.length; ii < iiLeng; ii++) {
      console.log(`[${ii + 1}/${iiLeng}] run`)

      const { type, content } = job.data.files[ii]

      let jsonData = await csvtojson().fromString(content)
      console.log(`| json data length ${jsonData.length}`)

      let resources = DuplicatorActions.revertData(type, jsonData)
      console.log(`| resources length ${resources.length}`)

      for (let i = 0, leng = Math.ceil(resources.length / LIMIT_PER_PROCESS); i < leng; i++) {
        console.log(`\t[${i + 1}/${leng}] run`)

        let _resources = resources.slice(i * LIMIT_PER_PROCESS, (i + 1) * LIMIT_PER_PROCESS)

        console.log(`\t| import data...`)
        let created = await DuplicatorActions.createData({
          shop,
          accessToken,
          type,
          resources: _resources,
        })

        result.push({ type, result: created })

        console.log(`\t[${i + 1}/${leng}] completed`)
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

const DuplicatorImportMiddleware = { create }

export default DuplicatorImportMiddleware
