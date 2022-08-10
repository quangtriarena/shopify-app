import {
  SmartCollectionFields,
  SmartCollectionRuleFields,
  CollectionImageFields,
  MetafieldFields,
} from './duplicator_constants.js'
import { getFieldValue } from './duplicator_helpers.js'

export default (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { smart_collection, image, rules, metafields } = dataList[ii]

      const length = Math.max(rules.length, metafields.length)

      for (let i = 0; i < length; i++) {
        let row = {}

        SmartCollectionFields.forEach((key) => {
          switch (key) {
            case 'id':
            case 'handle':
              row[key] = getFieldValue(smart_collection[key])
              break

            default:
              row[key] = i === 0 ? getFieldValue(smart_collection[key]) : ''
              break
          }
        })

        SmartCollectionRuleFields.forEach(
          (key) => (row['rule_' + key] = getFieldValue(rules[i]?.[key]))
        )

        CollectionImageFields.forEach(
          (key) => (row['image_' + key] = i === 0 ? getFieldValue(image?.[key]) : '')
        )

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
