import {
  SmartCollectionFields,
  SmartCollectionRuleFields,
  CollectionImageFields,
  MetafieldFields,
} from './duplicator_constants.js'

export default (data) => {
  try {
    let resources = []

    data.forEach((row) => {
      let index = resources.map((item) => item['id']).indexOf(row['id'])
      if (index >= 0) {
        // already exist
        resources[index].rows.push(row)
      } else {
        // new item
        resources.push({ ['id']: row['id'], rows: [row] })
      }
    })

    for (let ii = 0; ii < resources.length; ii++) {
      const rows = resources[ii].rows

      /**
       * smart collection
       */
      let smart_collection = {}
      SmartCollectionFields.filter((key) => !['id'].includes(key)).forEach((key) => {
        switch (key) {
          case 'disjunctive':
            smart_collection[key] = Boolean(String(rows[0][key]) === 'true')
            break

          default:
            smart_collection[key] = rows[0][key]
            break
        }
      })

      /**
       * image
       */
      let image = {}
      CollectionImageFields.forEach((key) => (image[key] = rows[0]['image_' + key]))

      /**
       * rules
       */
      let rules = rows
        .map((row) => {
          let obj = {}
          SmartCollectionRuleFields.forEach((key) => (obj[key] = row['rule_' + key]))
          return obj
        })
        .filter((item) => item.column)

      /**
       * metafields
       */
      let metafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.filter(
            (key) => !['id', 'owner_id', 'owner_resource'].includes(key)
          ).forEach((key) => (obj[key] = row['metafield_' + key]))
          return obj
        })
        .filter((item) => item.namespace && item.key)
      metafields.push({
        key: 'origin_id',
        value: String(rows[0].id),
        type: 'single_line_text_field',
        namespace: 'arena_duplicator',
      })

      resources[ii] = { smart_collection, image, rules, metafields }
    }

    return resources
  } catch (error) {
    throw error
  }
}
