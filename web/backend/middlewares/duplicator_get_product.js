import MetafieldMiddleware from './metafield.js'
import ProductMiddleware from './product.js'
import ProductImageMiddleware from './product_image.js'
import ProductVariantMiddleware from './product_variant.js'

export default async ({ shop, accessToken, id }) => {
  try {
    /**
     * get product
     */
    let product = await ProductMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    product = product.product
    console.log(`\t\t\t product ${product.id}`)

    delete product.variants
    delete product.images
    delete product.image

    /**
     * get product metafields
     */
    let productMetafields = await MetafieldMiddleware.find({
      shop,
      accessToken,
      resource: `products/${product.id}/`,
    })
    productMetafields = productMetafields.metafields
    console.log(`\t\t\t total metafields ${productMetafields.length}`)

    /**
     * get variants
     */
    let variants = await ProductVariantMiddleware.find({
      shop,
      accessToken,
      product_id: product.id,
    })
    variants = variants.variants
    console.log(`\t\t\t total variants ${variants.length}`)

    /**
     * get variants metafields
     */
    let variantsMetafields = []
    for (let i = 0, leng = variants.length; i < leng; i++) {
      let metafields = []

      metafields = await MetafieldMiddleware.find({
        shop,
        accessToken,
        resource: `variants/${variants[i].id}/`,
      })
      metafields = metafields.metafields

      variantsMetafields = variantsMetafields.concat(metafields)
    }
    console.log(`\t\t\t total variants metafields ${variantsMetafields.length}`)

    /**
     * get images
     */
    let images = await ProductImageMiddleware.find({
      shop,
      accessToken,
      product_id: product.id,
    })
    images = images.images
    console.log(`\t\t\t total images ${images.length}`)

    /**
     * get images metafields
     */
    let imagesMetafields = []
    for (let i = 0, leng = images.length; i < leng; i++) {
      let metafields = []

      metafields = await MetafieldMiddleware.find({
        shop,
        accessToken,
        resource: `product_images/${images[i].id}/`,
      })
      metafields = metafields.metafields

      imagesMetafields = imagesMetafields.concat(metafields)
    }
    console.log(`\t\t\t total images metafields ${imagesMetafields.length}`)

    return {
      product,
      productMetafields,
      variants,
      variantsMetafields,
      images,
      imagesMetafields,
    }
  } catch (error) {
    throw error
  }
}
