import {
  CustomCollectionFields,
  CollectionImageFields,
  MetafieldFields,
} from './duplicator_constants.js'
import { getFieldValue } from './duplicator_helpers.js'

export default (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { custom_collection, image, products, metafields } = dataList[ii]

      const length = Math.max(products.length, metafields.length)

      for (let i = 0; i < length; i++) {
        let row = {}

        CustomCollectionFields.forEach((key) => {
          switch (key) {
            case 'id':
            case 'handle':
              row[key] = getFieldValue(custom_collection[key])
              break

            default:
              row[key] = i === 0 ? getFieldValue(custom_collection[key]) : ''
              break
          }
        })

        CollectionImageFields.forEach(
          (key) => (row['image_' + key] = i === 0 ? getFieldValue(image?.[key]) : '')
        )

        row['product_id'] = getFieldValue(products[i]?.['id'])

        MetafieldFields.forEach(
          (key) => (row['metafield_' + key] = getFieldValue(metafields[i]?.[key]))
        )

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}
