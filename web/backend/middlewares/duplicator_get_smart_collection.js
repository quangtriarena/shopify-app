import CollectionMiddleware from './collection.js'
import SmartCollectionMiddleware from './smart_collection.js'
import MetafieldMiddleware from './metafield.js'

export default async ({ shop, accessToken, id }) => {
  try {
    /**
     * get smart collection
     */
    let smart_collection = await SmartCollectionMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    smart_collection = smart_collection.smart_collection
    console.log(`\t\t\t smart_collection ${smart_collection.id}`)

    /**
     * get smart collection rules
     */
    let rules = smart_collection.rules
    console.log(`\t\t\t total rules ${rules.length}`)

    delete smart_collection.rules

    /**
     * get smart collection image
     */
    let image = smart_collection.image
    console.log(`\t\t\t has image ${Boolean(image)}`)

    delete smart_collection.image

    /**
     * get smart collection metafields
     */
    let metafields = await MetafieldMiddleware.find({
      shop,
      accessToken,
      resource: `smart_collections/${smart_collection.id}/`,
    })
    metafields = metafields.metafields
    console.log(`\t\t\t metafields ${metafields.length}`)

    return {
      smart_collection,
      rules,
      image,
      metafields,
    }
  } catch (error) {
    throw error
  }
}
