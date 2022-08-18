import apiCaller from '../helpers/apiCaller.js'
import validateParams from '../helpers/validateParams.js'
import StoreSettingMiddleware from './store_setting.js'

const checkCode = async ({ shop, uuid }) => {
  try {
    let duplicatorStore = await StoreSettingMiddleware.findByUuid(uuid)
      .then((res) => res)
      .catch((err) => {
        throw new Error('Invalid unique code')
      })

    let storeSetting = await StoreSettingMiddleware.getByShop(shop)

    if (storeSetting.uuid === uuid) {
      throw new Error('Duplicator store cannot be your store')
    }

    if (duplicatorStore.duplicator === storeSetting.uuid) {
      throw new Error('Cannot set your child store as your duplicator store')
    }

    storeSetting = await StoreSettingMiddleware.update(storeSetting.id, { duplicator: uuid })
    storeSetting = await StoreSettingMiddleware.getBySession({ shop })

    return { store: storeSetting, duplicatorStore }
  } catch (error) {
    throw error
  }
}

const DuplicatoreMiddleware = {
  checkCode,
}

export default DuplicatoreMiddleware
