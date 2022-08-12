import Model from '../models/store_setting.js'
import ErrorCodes from '../constants/errorCodes.js'
import BillingMiddleware from '../middlewares/billing.js'

const STATUS = {
  RUNNING: 'RUNNING',
  UNINSTALLED: 'UNINSTALLED',
}
const ROLE = {
  GUEST: 'GUEST',
  MEMBERSHIP: 'MEMBERSHIP',
  ADMIN: 'ADMIN',
}
const APP_PLAN = {
  BASIC: 'BASIC',
  PRO: 'PRO',
  PLUS: 'PLUS',
}

export default {
  STATUS,
  ROLE,
  APP_PLAN,

  count: async () => {
    try {
      return await Model.count()
    } catch (error) {
      throw { message: error.message }
    }
  },

  find: async ({ page, limit }) => {
    try {
      let _page = page ? (parseInt(page) >= 1 ? parseInt(page) : 1) : 1
      let _limit = limit ? (parseInt(limit) >= 1 ? parseInt(limit) : 20) : 20

      const count = await Model.count()
      const items = await Model.findAll({
        limit: _limit,
        offset: (_page - 1) * _limit,
        order: [['updatedAt', 'DESC']],
      })

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

  findByUuid: async (uuid) => {
    try {
      let entry = await Model.findOne({ where: { uuid } })
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

  init: async (session) => {
    try {
      let storeSetting = await Model.findOne({ where: { shop: session.shop } })
      if (!storeSetting) {
        /**
         * Init new store
         */
        storeSetting = await Model.create({
          shop: session.shop,
          accessToken: session.accessToken,
          scope: session.scope,
        })
        storeSetting = storeSetting.toJSON()
      } else {
        /**
         * App already install
         */
        storeSetting = storeSetting.toJSON()

        /**
         * Update store
         */
        if (
          storeSetting.accessToken !== session.accessToken ||
          storeSetting.scope !== session.scope ||
          storeSetting.status !== STATUS.RUNNING
        ) {
          storeSetting = await Model.update(
            {
              accessToken: session.accessToken,
              status: STATUS.RUNNING,
            },
            {
              where: { id: storeSetting.id },
              returning: true,
              plain: true,
            },
          )
          storeSetting = storeSetting[1].toJSON()
        }
      }

      return storeSetting
    } catch (error) {
      throw { message: error.message }
    }
  },

  getByShop: async (shop) => {
    try {
      let storeSetting = await Model.findOne({ where: { shop } })
      if (!storeSetting) {
        throw new Error(ErrorCodes.UNAUTHORIZED)
      }

      return storeSetting.toJSON()
    } catch (error) {
      throw { message: error.message }
    }
  },

  getBySession: async (session) => {
    try {
      let storeSetting = await Model.findOne({ where: { shop: session.shop } })
      if (!storeSetting) {
        throw new Error(ErrorCodes.UNAUTHORIZED)
      }
      storeSetting = storeSetting.toJSON()

      /**
       * Check billings
       */
      if (storeSetting.billings) {
        let billings = storeSetting.billings
        let updated = false

        for (let i = 0; i < billings.length; i++) {
          if (billings[i].status === 'pending') {
            let appBilling = BillingMiddleware.getAppBillingById(billings[i].app_billing_id)

            let billingRes = await BillingMiddleware.get({
              shop: session.shop,
              accessToken: session.accessToken,
              type: billings[i].type,
              id: billings[i].id,
            })

            switch (billingRes[billings[i].type].status) {
              case 'pending':
                // nothing
                break

              case 'active':
                if (billings[i].type === 'application_charge') {
                  // application_charge
                  storeSetting.credits += appBilling.credits[storeSetting.appPlan]
                } else if (billings[i].type === 'recurring_application_charge') {
                  // recurring_application_charge
                  storeSetting.appPlan = appBilling.plan
                }

                billings[i] = {
                  ...billings[i],
                  status: billingRes[billings[i].type].status,
                }
                updated = true
                break

              default:
                billings[i] = {
                  ...billings[i],
                  status: billingRes[billings[i].type].status,
                }
                updated = true
                break
            }
          }
        }

        if (updated) {
          // remove draft billings
          billings = billings.filter((item) => ['pending', 'active'].includes(item.status))

          // update store setting
          storeSetting = await Model.update(
            {
              billings: JSON.stringify(billings),
              appPlan: storeSetting.appPlan,
              credits: storeSetting.credits,
            },
            {
              where: { id: storeSetting.id },
              returning: true,
              plain: true,
            },
          )
          storeSetting = storeSetting[1].toJSON()
        }
      }

      console.log('storeSetting :>> ', storeSetting)

      return storeSetting
    } catch (error) {
      throw { message: error.message }
    }
  },
}
