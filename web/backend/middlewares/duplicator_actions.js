import ProductMiddleware from './product.js'
import MetafieldMiddleware from './metafield.js'
import AdminZipMiddleware from './adm_zip.js'
import fs from 'fs'
import AdmZip from 'adm-zip'
import request from 'request'

import { ValidResources } from './duplicator_constants.js'

import getProduct from './duplicator_get_product.js'
import getCustomCollection from './duplicator_get_custom_collection.js'
import getSmartCollection from './duplicator_get_smart_collection.js'

import convertProduct from './duplicator_convert_product.js'
import convertCustomCollection from './duplicator_convert_custom_collection.js'
import convertSmartCollection from './duplicator_convert_smart_collection.js'

import revertProduct from './duplicator_revert_product.js'
import revertCustomCollection from './duplicator_revert_custom_collection.js'
import revertSmartCollection from './duplicator_revert_smart_collection.js'

import createProduct from './duplicator_create_product.js'
import createCustomCollection from './duplicator_create_custom_collection.js'
import createSmartCollection from './duplicator_create_smart_collection.js'

import csv from './duplicator_csv.js'

import cdn from './duplicator_cdn.js'

const getProductsWithOriginIdMetafields = async ({ shop, accessToken }) => {
  try {
    let products = []

    console.log(`\t\t get all products with origin id metafield...`)
    products = await ProductMiddleware.getAll({ shop, accessToken })
    products = products.map((item) => ({ id: item.id }))

    for (let i = 0, leng = products.length; i < leng; i++) {
      let metafields = await MetafieldMiddleware.find({
        shop,
        accessToken,
        resource: `products/${products[i].id}/`,
      })
      metafields = metafields.metafields

      let metafield = metafields.find(
        (item) => item.key === 'origin_id' && item.namespace === 'arena_duplicator',
      )
      if (metafield) {
        products[i].origin_id = metafield.value
      }
    }

    products = products.filter((item) => item.origin_id)
    console.log(`\t\t total products has origin id metafield ${products.length}`)

    return products
  } catch (error) {
    console.log('DuplicatorActions.getProductsWithOriginIdMetafields error :>> ', error)
    throw error
  }
}

const getData = async ({ shop, accessToken, type, resources }) => {
  try {
    let dataList = []

    for (let i = 0, leng = resources.length; i < leng; i++) {
      console.log(`\t\t [${i + 1}/${leng}] run`)
      let data = {}

      switch (type) {
        case 'product':
          data = await getProduct({ shop, accessToken, id: resources[i].id })
          break

        case 'custom_collection':
          data = await getCustomCollection({ shop, accessToken, id: resources[i].id })
          break

        case 'smart_collection':
          data = await getSmartCollection({ shop, accessToken, id: resources[i].id })
          break

        default:
          throw new Error('Invalid type')
          break
      }

      dataList.push(data)
      console.log(`\t\t [${i + 1}/${leng}] completed`)
    }

    return dataList
  } catch (error) {
    console.log('DuplicatorActions.getData error :>> ', error)
    throw error
  }
}

const convertData = (type, dataList) => {
  try {
    switch (type) {
      case 'product':
        return convertProduct(dataList)
        break

      case 'custom_collection':
        return convertCustomCollection(dataList)
        break

      case 'smart_collection':
        return convertSmartCollection(dataList)
        break

      default:
        throw new Error('Invalid type')
        break
    }
  } catch (error) {
    console.log('DuplicatorActions.convertData error :>> ', error)
    throw error
  }
}

const createCSV = (dataList) => {
  try {
    return csv(dataList)
  } catch (error) {
    console.log('DuplicatorActions.createCSV error :>> ', error)
    throw error
  }
}

const uploadCDN = async ({ shop, accessToken, type, value }) => {
  try {
    return await cdn({ shop, accessToken, type, value })
  } catch (error) {
    console.log('DuplicatorActions.uploadCDN error :>> ', error)
    throw error
  }
}

const revertData = (type, data) => {
  try {
    switch (type) {
      case 'product':
        return revertProduct(data)
        break

      case 'custom_collection':
        return revertCustomCollection(data)
        break

      case 'smart_collection':
        return revertSmartCollection(data)
        break

      default:
        throw new Error('Invalid type')
        break
    }
  } catch (error) {
    console.log('DuplicatorActions.revertData error :>> ', error)
    throw error
  }
}

const createData = async ({ shop, accessToken, type, resources }) => {
  try {
    let dataList = []

    let productsHasOriginId = []
    switch (type) {
      case 'custom_collection':
        productsHasOriginId = await getProductsWithOriginIdMetafields({ shop, accessToken })
        break

      default:
        break
    }

    for (let i = 0, leng = resources.length; i < leng; i++) {
      console.log(`\t\t [${i + 1}/${leng}] run`)
      let data = {}

      switch (type) {
        case 'product':
          data = await createProduct({ shop, accessToken, data: resources[i] })
          break

        case 'custom_collection':
          let custom_collection = resources[i]

          custom_collection.products = resources[i].products
            .map((item) => productsHasOriginId.find((_item) => _item.origin_id == item)?.id || '')
            .filter((item) => item)

          data = await createCustomCollection({ shop, accessToken, data: custom_collection })
          break

        case 'smart_collection':
          data = await createSmartCollection({ shop, accessToken, data: resources[i] })
          break

        default:
          throw new Error('Invalid type')
          break
      }

      dataList.push(data)
      console.log(`\t\t [${i + 1}/${leng}] completed`)
    }

    return dataList
  } catch (error) {
    console.log('DuplicatorActions.createData error :>> ', error)
    throw error
  }
}

const handleFilename = (filename) => {
  try {
    let obj = {}
    let _filename = filename

    // extension
    obj.extension = '.csv'
    _filename = _filename.split('.')[0]

    // totalProcesses
    obj.totalProcesses = parseInt(
      _filename.substring(_filename.lastIndexOf('_') + 1, _filename.length),
    )
    _filename = _filename.substring(0, _filename.lastIndexOf('_'))

    // process
    obj.process = parseInt(_filename.substring(_filename.lastIndexOf('_') + 1, _filename.length))
    _filename = _filename.substring(0, _filename.lastIndexOf('_'))

    // type
    obj.type = _filename

    return obj
  } catch (error) {
    throw error
  }
}

const generatePackageName = (shop) => {
  try {
    let _shop = shop.replace(/.myshopify.com/g, '')
    let _timestamp = new Date()
      .toISOString()
      .replace(/-/g, '')
      .replace(/\./g, '')
      .replace(/:/g, '')
      .replace(/T/g, '')
      .replace(/Z/g, '')

    return `package_${_shop}_${_timestamp}.zip`
  } catch (error) {
    throw error
  }
}

const handleImportFile = async (filepath) => {
  try {
    let zip = new AdmZip(filepath)

    let files = zip.getEntries()
    files = files.map((item) => {
      const file = item.toJSON()

      const { type } = handleFilename(file.name)
      const content = zip.readAsText(item)

      return { name: file.name, type, content }
    })

    // sort files
    let _files = []
    ValidResources.forEach((resourceType) =>
      files.forEach((file) => (file.type === resourceType ? _files.push(file) : null)),
    )
    files = _files

    fs.unlink(filepath, (err) => {
      if (err) {
        console.log(`Delete import file failed: ${err.message}`)
      } else {
        // console.log(`Import file deleted`)
      }
    })

    return { files }
  } catch (error) {
    throw error
  }
}

const download = (url) => {
  try {
    return new Promise(function (resolve, reject) {
      request(
        {
          url: url,
          method: 'GET',
          encoding: null,
        },
        function (err, response, body) {
          if (err) {
            return reject(err)
          }
          resolve(body)
        },
      )
    })
  } catch (error) {
    throw error
  }
}

const unzip = (buffer) => {
  try {
    return new Promise(function (resolve, reject) {
      let zip = new AdmZip(buffer)

      let files = zip.getEntries() // an array of ZipEntry records

      files = files.map((item) => {
        const file = item.toJSON()

        const { type } = handleFilename(file.name)
        const content = zip.readAsText(item)

        return { name: file.name, type, content }
      })

      // sort files
      let _files = []
      ValidResources.forEach((resourceType) =>
        files.forEach((file) => (file.type === resourceType ? _files.push(file) : null)),
      )
      files = _files

      resolve({ files })
    })
  } catch (error) {
    throw error
  }
}

const downloadAndUnzipFile = async (url) => {
  try {
    let buffer = await download(url)

    let { files } = await unzip(buffer)

    return { files }
  } catch (error) {
    throw error
  }
}

const DuplicatorActions = {
  getProductsWithOriginIdMetafields,
  getData,
  convertData,
  revertData,
  createData,
  createCSV,
  uploadCDN,
  handleFilename,
  generatePackageName,
  handleImportFile,
  downloadAndUnzipFile,
}

export default DuplicatorActions
