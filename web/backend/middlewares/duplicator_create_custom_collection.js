import CustomCollectionMiddleware from './custom_collection.js'
import MetafieldMiddleware from './metafield.js'

export default async ({ shop, accessToken, data }) => {
  try {
    const { custom_collection, image, products, metafields } = data

    let result = {}

    /**
     * create custom collection
     */
    let customCollectionCreated = { ...custom_collection }

    if (image?.src) {
      customCollectionCreated.image = image
    }
    if (products?.length) {
      customCollectionCreated.collects = products.map((item) => ({ product_id: item }))
    }

    customCollectionCreated = await CustomCollectionMiddleware.create({
      shop,
      accessToken,
      data: { custom_collection: customCollectionCreated },
    })
      .then((res) => {
        console.log(`\t\t\t custom collection created ${res.custom_collection.id}`)
        result = {
          success: true,
          id: res.custom_collection.id,
          handle: res.custom_collection.handle,
        }
        return res.custom_collection
      })
      .catch((err) => {
        console.log(`\t\t\t create custom collection failed with error: ${err.message}`)
        result = { success: false, message: err.message, handle: custom_collection.handle }
        return null
      })

    if (!result.success) {
      return result
    }

    /**
     * create metafields
     */
    for (let i = 0, leng = metafields.length; i < leng; i++) {
      await MetafieldMiddleware.create({
        shop,
        accessToken,
        resource: `custom_collections/${customCollectionCreated.id}/`,
        data: { metafield: metafields[i] },
      })
        .then((res) => {
          console.log(`\t\t\t metafield created ${res.metafield.id}`)
        })
        .catch((err) => {
          console.log(`\t\t\t create metafield failed with error: ${err.message}`)
        })
    }

    return result
  } catch (error) {
    throw error
  }
}
