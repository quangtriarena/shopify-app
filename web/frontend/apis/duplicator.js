import apiCaller from '../helpers/apiCaller'

const _export = async (data) => {
  return await apiCaller(`/api/duplicator-export`, 'POST', data)
}

const _import = async (data) => {
  const formData = new FormData()

  if (data.files?.length) {
    data.files.forEach((file) => formData.append('files', file))
  }

  return await apiCaller(`/api/duplicator-import`, 'POST', formData, {
    'Content-Type': 'multipart/form-data',
  })
}

const DuplicatorApi = { export: _export, import: _import }

export default DuplicatorApi
