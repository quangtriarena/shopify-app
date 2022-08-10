import apiCaller from '../helpers/apiCaller.js'
import validateParams from '../helpers/validateParams.js'

/**
 * https://shopify.dev/api/admin-rest/2021-10/resources/product-image
 */

const count = async ({ shop, accessToken, product_id }) => {
  try {
    validateParams({ shop, accessToken, product_id })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images/count.json`,
    })
  } catch (error) {
    throw error
  }
}

const find = async ({ shop, accessToken, product_id }) => {
  try {
    validateParams({ shop, accessToken, product_id })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images.json`,
    })
  } catch (error) {
    throw error
  }
}

const findById = async ({ shop, accessToken, product_id, image_id }) => {
  try {
    validateParams({ shop, accessToken, product_id, image_id })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images/${image_id}.json`,
    })
  } catch (error) {
    throw error
  }
}

const create = async ({ shop, accessToken, product_id, data }) => {
  try {
    validateParams({ shop, accessToken, product_id, data })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images.json`,
      method: 'POST',
      data,
    })
  } catch (error) {
    throw error
  }
}

const update = async ({ shop, accessToken, product_id, image_id, data }) => {
  try {
    validateParams({ shop, accessToken, product_id, image_id, data })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images/${image_id}.json`,
      method: 'PUT',
      data,
    })
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, product_id, image_id }) => {
  try {
    validateParams({ shop, accessToken, product_id, image_id })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images/${image_id}.json`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const ProductImageMiddleware = {
  count,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default ProductImageMiddleware
