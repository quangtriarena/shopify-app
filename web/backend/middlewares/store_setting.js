import Repository from './../repositories/store_setting.js'

const count = async () => {
  try {
    return await Repository.count()
  } catch (error) {
    throw error
  }
}

const find = async (filter) => {
  try {
    return await Repository.find(filter)
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

const findOne = async (where) => {
  try {
    return await Repository.findOne(where)
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

const init = async (session) => {
  try {
    return await Repository.init(session)
  } catch (error) {
    throw error
  }
}

const getBySession = async (session) => {
  try {
    return await Repository.getBySession(session)
  } catch (error) {
    throw error
  }
}

const StoreSettingMiddleware = {
  count,
  find,
  findById,
  findOne,
  create,
  update,
  // delete: _delete,
  init,
  getBySession,
}

export default StoreSettingMiddleware
