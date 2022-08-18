import apiCaller from '../helpers/apiCaller'

const update = async (id, data) => {
  return await apiCaller(`/api/duplicator/${id}`, 'PUT', data)
}

const _delete = async (id) => {
  return await apiCaller(`/api/duplicator/${id}`, 'DELETE')
}

const getPackages = async () => {
  return await apiCaller(`/api/duplicator-packages`)
}

const getDuplicatorPackages = async () => {
  return await apiCaller(`/api/duplicator-duplicator-packages`)
}

const checkCode = async (data) => {
  return await apiCaller(`/api/duplicator-check-code`, 'POST', data)
}

const _export = async (data) => {
  return await apiCaller(`/api/duplicator-export`, 'POST', data)
}

const _import = async (data) => {
  return await apiCaller(`/api/duplicator-import`, 'POST', data)
}

const DuplicatorApi = {
  update,
  delete: _delete,
  getPackages,
  getDuplicatorPackages,
  checkCode,
  export: _export,
  import: _import,
}

export default DuplicatorApi
