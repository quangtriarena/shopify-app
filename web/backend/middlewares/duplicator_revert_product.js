import {
  ProductFields,
  MetafieldFields,
  VariantFields,
  ImageFields,
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
       * product metafields
       */
      let productMetafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['product_metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      /**
       * variants metafields
       */
      let variantsMetafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['variant_metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      /**
       * images metafields
       */
      let imagesMetafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['image_metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      /**
       * variants
       */
      let variants = rows
        .map((row) => {
          let obj = {}
          VariantFields.forEach((key) => {
            switch (key) {
              case 'inventory_item_id':
                break

              default:
                obj[key] = row['variant_' + key]
                break
            }
          })
          obj.metafields = [
            {
              key: 'origin_id',
              value: String(row['variant_' + 'id']),
              type: 'single_line_text_field',
              namespace: 'arena_duplicator',
            },
          ]
          return obj
        })
        .filter((item) => item.title)
      for (let i = 0; i < variants.length; i++) {
        let _metafields = variantsMetafields.filter((item) => item.owner_id === variants[i].id)
        variants[i].metafields = variants[i].metafields.concat(_metafields)
      }

      /**
       * images
       */
      let images = rows
        .map((row) => {
          let obj = {}
          ImageFields.forEach((key) => {
            switch (key) {
              case 'id':
                break

              case 'variant_ids':
                obj[key] = row['image_' + key].split(',').filter((item) => item)
                break

              default:
                obj[key] = row['image_' + key]
                break
            }
          })
          obj.metafields = [
            {
              key: 'origin_id',
              value: String(row['image_' + 'id']),
              type: 'single_line_text_field',
              namespace: 'arena_duplicator',
            },
          ]
          return obj
        })
        .filter((item) => item.src)
      for (let i = 0; i < images.length; i++) {
        let _metafields = imagesMetafields.filter((item) => item.owner_id === images[i].id)
        images[i].metafields = images[i].metafields.concat(_metafields)
      }

      /**
       * product
       */
      let product = {}
      ProductFields.forEach((key) => {
        switch (key) {
          case 'id':
          case 'option1_name':
          case 'option1_values':
          case 'option2_name':
          case 'option2_values':
          case 'option3_name':
          case 'option3_values':
            break

          default:
            product[key] = rows[0][key]
            break
        }
      })

      product.options = []
      Array.from([1, 2, 3]).forEach((position) => {
        if (rows[0][`option${position}_name`]) {
          product.options.push({
            name: rows[0][`option${position}_name`],
            position,
            values: rows[0][`option${position}_values`].split(',').filter((item) => item),
          })
        }
      })

      product.variants = variants.map((item) => {
        let obj = { ...item }
        delete obj.id
        delete obj.image_id
        delete obj.inventory_item_id
        delete obj.metafields
        return obj
      })

      product.metafields = [
        ...productMetafields.map((item) => {
          let obj = { ...item }
          delete obj.id
          delete obj.owner_id
          delete obj.owner_resource
          return obj
        }),
        {
          key: 'origin_id',
          value: String(rows[0].id),
          type: 'single_line_text_field',
          namespace: 'arena_duplicator',
        },
      ]

      resources[ii] = { product, variants, images }
    }

    return resources
  } catch (error) {
    throw error
  }
}
