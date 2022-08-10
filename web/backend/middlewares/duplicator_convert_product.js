import {
  ProductFields,
  MetafieldFields,
  VariantFields,
  ImageFields,
} from './duplicator_constants.js'
import { getFieldValue } from './duplicator_helpers.js'

export default (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { product, productMetafields, variants, variantsMetafields, images, imagesMetafields } =
        dataList[ii]

      const length = Math.max(
        productMetafields.length,
        variants.length,
        variantsMetafields.length,
        images.length,
        imagesMetafields.length
      )

      for (let i = 0; i < length; i++) {
        let row = {}

        ProductFields.forEach((key) => {
          switch (key) {
            case 'id':
            case 'handle':
              row[key] = getFieldValue(product[key])
              break

            case 'option1_name':
            case 'option2_name':
            case 'option3_name':
              row[key] =
                i === 0
                  ? getFieldValue(
                      product.options.find((item) => key.includes(item.position))?.name || ''
                    )
                  : ''
              break

            case 'option1_values':
            case 'option2_values':
            case 'option3_values':
              row[key] =
                i === 0
                  ? getFieldValue(
                      product.options.find((item) => key.includes(item.position))?.values || []
                    )
                  : ''
              break

            default:
              row[key] = i === 0 ? getFieldValue(product[key]) : ''
              break
          }
        })
        VariantFields.forEach((key) => (row['variant_' + key] = getFieldValue(variants[i]?.[key])))
        ImageFields.forEach((key) => (row['image_' + key] = getFieldValue(images[i]?.[key])))
        MetafieldFields.forEach(
          (key) => (row['product_metafield_' + key] = getFieldValue(productMetafields[i]?.[key]))
        )
        MetafieldFields.forEach(
          (key) => (row['variant_metafield_' + key] = getFieldValue(variantsMetafields[i]?.[key]))
        )
        MetafieldFields.forEach(
          (key) => (row['image_metafield_' + key] = getFieldValue(imagesMetafields[i]?.[key]))
        )

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}
