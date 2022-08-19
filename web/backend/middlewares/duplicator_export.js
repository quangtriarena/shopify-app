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
    let storeSetting = await StoreSettingMiddleware.findOne({ shop })
    const { accessToken } = storeSetting

    // validate app plan

    // get duplicatorPackage
    const { duplicatorPackageId } = backgroundJob.data
    let duplicatorPackage = await DuplicatorPackageMiddleware.findById(duplicatorPackageId)
    console.log(`data`)
    console.log('duplicatorPackage.data :>> ', duplicatorPackage.data)

    // update backgroundJob status PENDING -> RUNNING
    duplicatorPackage = await DuplicatorPackageMiddleware.update(duplicatorPackageId, {
      status: 'RUNNING',
      result: null,
    })

    // create zip file
    const filename = DuplicatorActions.generatePackageName(shop)
    const rootDir = `./temp/`
    const filepath = rootDir + filename
    const zip = await AdminZipMiddleware.create(filepath)
    console.log(`zip file created ${filepath}`)

    /**
     * process
     */
    let result = null

    for (
      let ii = 0, totalProcesses = duplicatorPackage.data.resources.length;
      ii < totalProcesses;
      ii++
    ) {
      console.log(`[${ii + 1}/${totalProcesses}] run`)

      const { type, count } = duplicatorPackage.data.resources[ii]

      // get all resources
      console.log(`| get all ${type}s...`)
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
      console.log(`| total ${type}s ${resources.length}`)

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
        console.log(`\t| total rows ${rowsData.length}`)

        // create csv content
        let csvContent = DuplicatorActions.createCSV(rowsData)
        console.log(`\t| total characters ${csvContent.length}`)

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
        progress: Math.ceil(((ii + 1) / totalProcesses) * 100),
      })

      console.log(`[${ii + 1}/${totalProcesses}] completed`)
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
      status: 'COMPLETED',
      result: result ? JSON.stringify(result) : null,
    })
  } catch (error) {
    // update backgroundJob
    let backgroundJob = await BackgroundJobMiddleware.update(job.data.backgroundJobId, {
      status: 'FAILED',
      message: error.message,
    })

    // update duplicatorPackage
    let duplicatorPackage = await DuplicatorPackageMiddleware.update(
      backgroundJob.data.duplicatorPackageId,
      {
        status: 'FAILED',
        message: error.message,
      },
    )

    throw error
  }
}

const DuplicatorExportMiddleware = { create }

export default DuplicatorExportMiddleware
