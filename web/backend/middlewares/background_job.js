import Repository from '../repositories/background_job.js'

const find = async ({ page, limit, shop }) => {
  try {
    return await Repository.find({ page, limit, shop })
  } catch (error) {
    throw error
  }
}

const findById = async (id) => {
  try {
    return await Repository.findById(id)
  } catch (error) {
    throw error
  }
}

const create = async (data) => {
  try {
    return await Repository.create(data)
  } catch (error) {
    throw error
  }
}

const update = async (id, data) => {
  try {
    return await Repository.update(id, data)
  } catch (error) {
    throw error
  }
}

const _delete = async (id) => {
  try {
    return await Repository.delete(id)
  } catch (error) {
    throw error
  }
}

const BackgroundJobMiddleware = {
  STATUS: Repository.STATUS,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default BackgroundJobMiddleware
