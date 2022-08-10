import apiCaller from '../helpers/apiCaller.js'
import validateParams from '../helpers/validateParams.js'

const findById = async ({ shop, accessToken, id }) => {
  try {
    validateParams({ shop, accessToken, id })

    return await apiCaller({ shop, accessToken, endpoint: `collections/${id}.json` })
  } catch (error) {
    throw error
  }
}

const getProducts = async ({ shop, accessToken, id, query }) => {
  try {
    validateParams({ shop, accessToken, id })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `collections/${id}/products.json${query || ''}`,
    })
  } catch (error) {
    throw error
  }
}

const CollectionMiddleware = {
  findById,
  getProducts,
}

export default CollectionMiddleware
