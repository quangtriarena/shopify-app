import apiCaller from '../helpers/apiCaller'

const count = async () => {
  return await apiCaller(`/api/products/count`)
}

const find = async (query) => {
  return await apiCaller(`/api/products${query || ''}`)
}

const findById = async (id) => {
  return await apiCaller(`/api/products/${id}`)
}

const create = async (data) => {
  return await apiCaller(`/api/products`, 'POST', { product: data })
}

const update = async (id, data) => {
  return await apiCaller(`/api/products/${id}`, 'PUT', { product: data })
}

const _delete = async (id) => {
  return await apiCaller(`/api/products/${id}`, 'DELETE')
}

const ProductApi = {
  count,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default ProductApi
