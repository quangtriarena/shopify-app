import { useEffect, useState } from 'react'
import StoreSettingApi from './apis/store_setting'
import { useSelector, useDispatch } from 'react-redux'
import { selectNotify, showNotify } from './redux/reducers/notify'
import { selectAppLoading } from './redux/reducers/appLoading'
import { selectStoreSetting, setStoreSetting } from './redux/reducers/storeSetting'
import { NavigationMenu, Toast } from '@shopify/app-bridge-react'
import Preloader from './components/Preloader'
import Privacy from './components/Privacy'
import { Page } from '@shopify/polaris'

function AppContainer(props) {
  const { actions, children, storeSetting } = props

  const [isReady, setIsReady] = useState(false)

  const getStoreSetting = async () => {
    try {
      let res = await StoreSettingApi.auth()
      if (!res.success) {
        throw res.error
      }

      // check session expired
      if (res.data.status !== 'RUNNING') {
        return window.top.location.replace(
          `${window.BACKEND_URL}/api/auth?shop=${window.shopOrigin}`,
        )
      }

      actions.setStoreSetting(res.data)
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    getStoreSetting()
  }, [])

  useEffect(() => {
    console.log('---------------------------------------')
    console.log('Redux:')
    Object.keys(props)
      .filter((key) => key !== 'children')
      .forEach((key) => console.log('| ' + key + ' :>> ', props[key]))

    if (!isReady && storeSetting) {
      setIsReady(true)
    }
  }, [storeSetting])

  const acceptPrivacy = async () => {
    try {
      let res = await StoreSettingApi.update({ acceptedAt: new Date().toISOString() })
      if (!res.success) {
        throw res.error
      }

      actions.showNotify({ message: 'Privacy accepted' })
      actions.setStoreSetting(res.data)
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    }
  }

  if (!isReady) {
    return <Preloader />
  }

  return (
    <div>
      {storeSetting?.acceptedAt ? (
        children
      ) : (
        <Page fullWidth>
          <Privacy onAction={acceptPrivacy} />
        </Page>
      )}
    </div>
  )
}

export default AppContainer
