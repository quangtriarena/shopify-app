import Model from '../models/duplicator_package.js'
import ErrorCodes from '../constants/errorCodes.js'

export default {
  getAll: async (shop) => {
    try {
      let where = { shop }

      let filter = {
        where,
        limit: 1000,
        offset: 0,
        order: [['updatedAt', 'DESC']],
      }

      let items = await Model.findAll(filter)

      items = items.map((item) => item.toJSON())

      return items
    } catch (error) {
      throw { message: error.message }
    }
  },

  find: async ({ page, limit, shop }) => {
    try {
      let _page = page && parseInt(page) && parseInt(page) >= 1 ? parseInt(page) : 1
      let _limit = limit && parseInt(limit) && parseInt(limit) >= 1 ? parseInt(limit) : 20

      let where = {}
      if (shop) {
        where = { ...where, shop }
      }

      let filter = {
        where,
        limit: _limit,
        offset: (_page - 1) * _limit,
        order: [['updatedAt', 'DESC']],
      }

      let count = await Model.count({ where })
      let items = await Model.findAll(filter)

      return {
        items,
        page: _page,
        limit: _limit,
        totalPages: Math.ceil(count / _limit),
        totalItems: count,
      }
    } catch (error) {
      throw { message: error.message }
    }
  },

  findById: async (id) => {
    try {
      let entry = await Model.findOne({ where: { id } })
      if (!entry) {
        throw new Error(ErrorCodes.NOT_FOUND)
      }

      return entry.toJSON()
    } catch (error) {
      throw { message: error.message }
    }
  },

  create: async (data) => {
    try {
      const created = await Model.create(data)

      return created.toJSON()
    } catch (error) {
      throw { message: error.message }
    }
  },

  update: async (id, data) => {
    try {
      let updated = await Model.update(data, {
        where: { id },
        returning: true,
        plain: true,
      })

      return updated[1].toJSON()
    } catch (error) {
      throw { message: error.message }
    }
  },

  delete: async (id) => {
    try {
      return await Model.destroy({ where: { id } })
    } catch (error) {
      throw { message: error.message }
    }
  },
}
