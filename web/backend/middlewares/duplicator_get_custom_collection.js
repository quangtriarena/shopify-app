import CollectionMiddleware from './collection.js'
import CustomCollectionMiddleware from './custom_collection.js'
import MetafieldMiddleware from './metafield.js'

export default async ({ shop, accessToken, id }) => {
  try {
    /**
     * get custom collection
     */
    let custom_collection = await CustomCollectionMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    custom_collection = custom_collection.custom_collection
    console.log(`\t\t\t custom_collection ${custom_collection.id}`)

    /**
     * get custom collection image
     */
    let image = custom_collection.image
    console.log(`\t\t\t has image ${Boolean(image)}`)

    delete custom_collection.image

    /**
     * get custom collection products
     */
    let products = await CollectionMiddleware.getProducts({
      shop,
      accessToken,
      id: custom_collection.id,
      query: '?fields=id',
    })
    products = products.products
    console.log(`\t\t\t total products ${products.length}`)

    /**
     * get custom collection metafields
     */
    let metafields = await MetafieldMiddleware.find({
      shop,
      accessToken,
      resource: `custom_collections/${custom_collection.id}/`,
    })
    metafields = metafields.metafields
    console.log(`\t\t\t total metafields ${metafields.length}`)

    return {
      custom_collection,
      image,
      products,
      metafields,
    }
  } catch (error) {
    throw error
  }
}
