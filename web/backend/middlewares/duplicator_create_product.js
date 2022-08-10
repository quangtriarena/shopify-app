import MetafieldMiddleware from './metafield.js'
import ProductMiddleware from './product.js'
import ProductImageMiddleware from './product_image.js'
import ProductVariantMiddleware from './product_variant.js'

export default async ({ shop, accessToken, data }) => {
  try {
    const { product, variants, images } = data

    let result = {}

    /**
     * create product
     */
    let productCreated = { ...product }

    delete productCreated.metafields

    productCreated = await ProductMiddleware.create({
      shop,
      accessToken,
      data: { product: productCreated },
    })
      .then((res) => {
        console.log(`\t\t\t product created ${res.product.id}`)
        result = { success: true, id: res.product.id, handle: res.product.handle }
        return res.product
      })
      .catch((err) => {
        console.log(`\t\t\t create product failed with error: ${err.message}`)
        result = { success: false, message: err.message, handle: product.handle }
        return null
      })

    if (!result.success) {
      return result
    }

    /**
     * create metafields
     */
    for (let i = 0, leng = product.metafields.length; i < leng; i++) {
      await MetafieldMiddleware.create({
        shop,
        accessToken,
        resource: `products/${productCreated.id}/`,
        data: { metafield: product.metafields[i] },
      })
        .then((res) => {
          console.log(`\t\t\t metafield created ${res.metafield.id}`)
        })
        .catch((err) => {
          console.log(`\t\t\t create metafield failed with error: ${err.message}`)
        })
    }

    /**
     * create variants metafields
     */
    for (let i = 0, leng = variants.length; i < leng; i++) {
      let newVariant = productCreated.variants.find(
        (item) =>
          item.option1 === variants[i].option1 &&
          item.option2 === variants[i].option2 &&
          item.option3 === variants[i].option3
      )
      if (newVariant) {
        for (let j = 0, jLeng = variants[i].metafields.length; j < jLeng; j++) {
          await MetafieldMiddleware.create({
            shop,
            accessToken,
            resource: `variants/${newVariant.id}/`,
            data: { metafield: variants[i].metafields[j] },
          })
            .then((res) => {
              console.log(`\t\t\t variant metafield created ${res.metafield.id}`)
            })
            .catch((err) => {
              console.log(`\t\t\t create variant metafield failed with error: ${err.message}`)
            })
        }
      }
    }

    /**
     * create images
     */
    for (let i = 0, leng = images.length; i < leng; i++) {
      let imageCreated = { ...images[i] }

      delete imageCreated.id
      delete imageCreated.metafields

      imageCreated.product_id = productCreated.id
      imageCreated.variant_ids = imageCreated.variant_ids
        .map((item) => {
          let oldVariant = variants.find((_item) => _item.id === item)
          if (!oldVariant) {
            return null
          }

          let newVariant = productCreated.variants.find(
            (item) =>
              item.option1 === oldVariant.option1 &&
              item.option2 === oldVariant.option2 &&
              item.option3 === oldVariant.option3
          )
          if (!newVariant) {
            return null
          }

          return newVariant.id
        })
        .filter((item) => item)

      imageCreated = await ProductImageMiddleware.create({
        shop,
        accessToken,
        product_id: productCreated.id,
        data: { image: imageCreated },
      })
        .then((res) => {
          console.log(`\t\t\t image created ${res.image.id}`)
          return res.image
        })
        .catch((err) => {
          console.log(`\t\t\t create image failed with error: ${err.message}`)
          return null
        })

      if (imageCreated && images[i].metafields.length > 0) {
        for (let j = 0, jLeng = images[i].metafields.length; j < jLeng; j++) {
          await MetafieldMiddleware.create({
            shop,
            accessToken,
            resource: `product_images/${imageCreated.id}/`,
            data: { metafield: images[i].metafields[j] },
          })
            .then((res) => {
              console.log(`\t\t\t\t image metafield created ${res.metafield.id}`)
            })
            .catch((err) => {
              console.log(`\t\t\t\t create image metafield failed with error: ${err.message}`)
            })
        }
      }
    }

    return result
  } catch (error) {
    throw error
  }
}
