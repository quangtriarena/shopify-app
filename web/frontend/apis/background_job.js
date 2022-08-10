import apiCaller from '../helpers/apiCaller'

const find = async (query) => {
  return await apiCaller(`/api/background-jobs${query || ''}`)
}

const findById = async (id) => {
  return await apiCaller(`/api/background-jobs/${id}`)
}

const update = async (id, data) => {
  return await apiCaller(`/api/background-jobs/${id}`, 'PUT', data)
}

const _delete = async (id) => {
  return await apiCaller(`/api/background-jobs/${id}`, 'DELETE')
}

const BackgroundJobApi = { find, findById, update, delete: _delete }

export default BackgroundJobApi
