import {
  CustomCollectionFields,
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
       * custom collection
       */
      let custom_collection = {}
      CustomCollectionFields.filter((key) => !['id'].includes(key)).forEach(
        (key) => (custom_collection[key] = rows[0][key])
      )

      /**
       * image
       */
      let image = {}
      CollectionImageFields.forEach((key) => (image[key] = rows[0]['image_' + key]))
      image = image.src ? image : null

      /**
       * products
       */
      let products = rows.map((row) => row['product_' + 'id']).filter((item) => item)

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

      resources[ii] = { custom_collection, image, products, metafields }
    }

    return resources
  } catch (error) {
    throw error
  }
}
