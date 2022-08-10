import SmartCollectionMiddleware from './smart_collection.js'
import MetafieldMiddleware from './metafield.js'

export default async ({ shop, accessToken, data }) => {
  try {
    const { smart_collection, image, rules, metafields } = data

    let result = {}

    /**
     * create smart collection
     */
    let smartCollectionCreated = { ...smart_collection }

    if (image?.src) {
      smartCollectionCreated.image = image
    }
    if (rules?.length) {
      smartCollectionCreated.rules = rules
    }

    smartCollectionCreated = await SmartCollectionMiddleware.create({
      shop,
      accessToken,
      data: { smart_collection: smartCollectionCreated },
    })
      .then((res) => {
        console.log(`\t\t\t smart collection created ${res.smart_collection.id}`)
        result = { success: true, id: res.smart_collection.id, handle: res.smart_collection.handle }
        return res.smart_collection
      })
      .catch((err) => {
        console.log(`\t\t\t create smart collection failed with error: ${err.message}`)
        result = { success: false, message: err.message, handle: smart_collection.handle }
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
        resource: `smart_collections/${smartCollectionCreated.id}/`,
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
