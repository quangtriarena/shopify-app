import BackgroundJobMiddleware from './background_job.js'
import StoreSettingMiddleware from './store_setting.js'
import DuplicatorActions from './duplicator_actions.js'
import ProductMiddleware from './product.js'
import CustomCollectionMiddleware from './custom_collection.js'
import SmartCollectionMiddleware from './smart_collection.js'
import AdminZipMiddleware from './adm_zip.js'
import fs from 'fs'
import AwsMiddleware from './aws.js'
import DuplicatorPackageMiddleware from './duplicator_package.js'

const LIMIT_PER_PROCESS = 100

const create = async (job) => {
  const { shop, backgroundJobId, duplicatorPackageId } = job.data

  try {
    const filename = DuplicatorActions.generatePackageName(shop)
    const rootDir = `./temp/`
    const filepath = rootDir + filename

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

    // get duplicatorPackage
    let duplicatorPackage = await DuplicatorPackageMiddleware.findById(duplicatorPackageId)

    // update duplicatorPackage
    duplicatorPackage = await DuplicatorPackageMiddleware.update(duplicatorPackageId, {
      result: null,
    })

    // create zip file
    await AdminZipMiddleware.create(filepath)
    console.log(`zip file created ${filepath}`)

    let result = null

    // process
    for (let ii = 0, iiLeng = job.data.resources.length; ii < iiLeng; ii++) {
      console.log(`[${ii + 1}/${iiLeng}] run`)

      const { type, count } = job.data.resources[ii]

      // get all resources
      console.log(`| get all resources...`)
      let resources = []
      switch (type) {
        case 'product':
          resources = await ProductMiddleware.getAll({ shop, accessToken, count })
          break

        case 'custom_collection':
          resources = await CustomCollectionMiddleware.getAll({
            shop,
            accessToken,
            count,
          })
          break

        case 'smart_collection':
          resources = await SmartCollectionMiddleware.getAll({
            shop,
            accessToken,
            count,
          })
          break

        default:
          break
      }
      console.log(`| total resources ${resources.length}`)

      for (let i = 0, leng = Math.ceil(resources.length / LIMIT_PER_PROCESS); i < leng; i++) {
        console.log(`\t[${i + 1}/${leng}] run`)

        let _resouces = resources.slice(i * LIMIT_PER_PROCESS, (i + 1) * LIMIT_PER_PROCESS)

        // get export data
        console.log(`\t| get export data...`)
        let exportData = await DuplicatorActions.getData({
          shop,
          accessToken,
          type,
          resources: _resouces,
        })
        console.log(`\t| total export data ${exportData.length}`)

        // convert data to rows data
        let rowsData = DuplicatorActions.convertData(type, exportData)
        console.log(`\t| total rows data ${rowsData.length}`)

        // create csv content
        let csvContent = DuplicatorActions.createCSV(rowsData)
        console.log(`\t| csv content length ${csvContent.length}`)

        // update zip file
        let __process = i + 1 < 10 ? '0' + (i + 1) : i + 1
        let __total = leng < 10 ? '0' + leng : leng
        let __filename = `${type}/${type}_${__process}_${__total}.csv`
        await AdminZipMiddleware.update(filepath, [{ filename: __filename, content: csvContent }])
        console.log(`\t| zip file updated ${__filename}`)

        console.log(`\t[${i + 1}/${leng}] completed`)
      }

      // update background job
      backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
        status: 'RUNNING',
        progress: Math.ceil(((ii + 1) / iiLeng) * 100),
      })

      console.log(`[${ii + 1}/${iiLeng}] completed`)
    }

    // upload to s3
    let uploaded = await AwsMiddleware.upload(filename, filepath)
    console.log(`zip file uploaded into s3`)

    result = uploaded

    // update backgroundJob
    backgroundJob = await BackgroundJobMiddleware.update(backgroundJobId, {
      status: 'COMPLETED',
      progress: 100,
      result: result ? JSON.stringify(result) : null,
    })

    // update duplicatorPackage
    duplicatorPackage = await DuplicatorPackageMiddleware.update(duplicatorPackageId, {
      result: result ? JSON.stringify(result) : null,
    })
  } catch (error) {
    // update backgroundJob
    await BackgroundJobMiddleware.update(backgroundJobId, {
      status: 'FAILED',
      message: error.message,
    })

    throw error
  }
}

const DuplicatorExportMiddleware = { create }

export default DuplicatorExportMiddleware
