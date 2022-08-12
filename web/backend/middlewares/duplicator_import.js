import BackgroundJobMiddleware from './background_job.js'
import StoreSettingMiddleware from './store_setting.js'
import DuplicatorActions from './duplicator_actions.js'
import ProductMiddleware from './product.js'
import csvtojson from 'csvtojson'
import DuplicatorPackageMiddleware from './duplicator_package.js'

const LIMIT_PER_PROCESS = 100

const create = async (job) => {
  const { shop, backgroundJobId } = job.data

  try {
    // get backgroundJob
    let backgroundJob = await BackgroundJobMiddleware.findById(backgroundJobId)

    // check backgroundJob is running
    if (!['PENDING', 'RUNNING'].includes(backgroundJob.status)) {
      console.log(`| <<< PROCESS HAS BEEN ${backgroundJob.status} >>>`)
      return
    }

    // update backgroundJob
    if (backgroundJob.status === 'PENDING') {
      backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
        status: 'RUNNING',
      })
    }

    // get storeSetting
    let storeSetting = await StoreSettingMiddleware.getByShop(shop)
    const { accessToken } = storeSetting

    // validate app plan

    // get originalShop
    let originalShop = await StoreSettingMiddleware.findByUuid(job.data.uuid)
      .then((res) => res)
      .catch((err) => {
        throw { message: 'Original store not found' }
      })

    // get duplicatorPackage
    let duplicatorPackage = await DuplicatorPackageMiddleware.findById(job.data.package)
      .then((res) => res)
      .catch((err) => {
        throw { message: 'Package not found' }
      })

    // check package owner
    if (duplicatorPackage.shop !== originalShop.shop) {
      throw { message: 'Package permission denied' }
    }

    // check package already to use
    if (!duplicatorPackage.result) {
      throw { message: 'Package is not ready to use' }
    }

    // download and unzip files
    const { files } = await DuplicatorActions.downloadAndUnzipFile(
      duplicatorPackage.result.Location,
    )

    console.log(`Import files:`)
    console.log(files.map((file) => file.name))

    let result = []

    // process
    for (let ii = 0, iiLeng = files.length; ii < iiLeng; ii++) {
      console.log(`[${ii + 1}/${iiLeng}] run`)

      const { type, content } = files[ii]

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

      // update backgroundJob
      backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
        status: 'RUNNING',
        progress: Math.ceil(((ii + 1) / iiLeng) * 100),
      })

      console.log(`[${ii + 1}/${iiLeng}] completed`)
    }

    // update backgroundJob
    backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
      status: 'COMPLETED',
      progress: 100,
      result: result ? JSON.stringify(result) : null,
    })
  } catch (error) {
    // update backgroundJob
    backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
      status: 'FAILED',
      message: error.message,
    })

    throw error
  }
}

const DuplicatorImportMiddleware = { create }

export default DuplicatorImportMiddleware
