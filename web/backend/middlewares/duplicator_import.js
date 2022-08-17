import BackgroundJobMiddleware from './background_job.js'
import StoreSettingMiddleware from './store_setting.js'
import DuplicatorActions from './duplicator_actions.js'
import ProductMiddleware from './product.js'
import csvtojson from 'csvtojson'
import DuplicatorPackageMiddleware from './duplicator_package.js'

const LIMIT_PER_PROCESS = 100

const create = async (job) => {
  try {
    const { shop, backgroundJobId } = job.data

    // get backgroundJob
    let backgroundJob = await BackgroundJobMiddleware.findById(backgroundJobId)

    // check backgroundJob is running
    if (!['PENDING', 'RUNNING'].includes(backgroundJob.status)) {
      console.log(`<<< PROCESS HAS BEEN ${backgroundJob.status} >>>`)
      return
    }

    // update backgroundJob status PENDING -> RUNNING
    if (backgroundJob.status === 'PENDING') {
      backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
        status: 'RUNNING',
      })
    }

    // get storeSetting
    let storeSetting = await StoreSettingMiddleware.getByShop(shop)
    const { accessToken } = storeSetting

    // validate app plan

    // get duplicatorPackage
    let duplicatorPackage = await DuplicatorPackageMiddleware.findById(backgroundJob.data.package)
      .then((res) => res)
      .catch((err) => {
        throw new Error('Package not found')
      })

    // get duplicatorStore
    let duplicatorStore = await StoreSettingMiddleware.findByUuid(backgroundJob.data.uuid)
      .then((res) => res)
      .catch((err) => {
        throw new Error('Duplicator store not found')
      })

    // check package owner
    if (duplicatorPackage.shop !== duplicatorStore.shop) {
      throw new Error('Package permission denied')
    }

    // check package already to use
    if (duplicatorPackage.status !== 'COMPLETED') {
      throw new Error('Package is not ready to use')
    }

    // download and unzip files
    const { files } = await DuplicatorActions.downloadAndUnzipFile(
      duplicatorPackage.result.Location,
    )

    console.log(`Import files:`)
    console.log(files.map((file) => file.name))

    /**
     * process
     */
    let result = []

    for (let ii = 0, totalProcesses = files.length; ii < totalProcesses; ii++) {
      console.log(`[${ii + 1}/${totalProcesses}] run`)

      const { type, content } = files[ii]

      // convert csv content to json data
      let jsonData = await csvtojson().fromString(content)
      console.log(`| total json data ${jsonData.length}`)

      // revert json data to entry
      let resources = DuplicatorActions.revertData(type, jsonData)
      console.log(`| total ${type}s ${resources.length}`)

      for (let i = 0, leng = Math.ceil(resources.length / LIMIT_PER_PROCESS); i < leng; i++) {
        console.log(`\t[${i + 1}/${leng}] run`)

        let _resources = resources.slice(i * LIMIT_PER_PROCESS, (i + 1) * LIMIT_PER_PROCESS)

        console.log(`\t| import data...`)
        let createdList = await DuplicatorActions.createData({
          shop,
          accessToken,
          type,
          resources: _resources,
        })
        console.log(`\t| total imported ${createdList.length}`)

        result.push({ type, result: createdList })

        console.log(`\t[${i + 1}/${leng}] completed`)
      }

      // update backgroundJob
      backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
        status: 'RUNNING',
        progress: Math.ceil(((ii + 1) / totalProcesses) * 100),
      })

      console.log(`[${ii + 1}/${totalProcesses}] completed`)
    }

    // update backgroundJob
    backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
      status: 'COMPLETED',
      progress: 100,
      result: result ? JSON.stringify(result) : null,
    })
  } catch (error) {
    // update backgroundJob
    let backgroundJob = await BackgroundJobMiddleware.update(job.data.backgroundJobId, {
      status: 'FAILED',
      message: error.message,
    })

    throw error
  }
}

const DuplicatorImportMiddleware = { create }

export default DuplicatorImportMiddleware
