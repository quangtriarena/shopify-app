import { useEffect, useState } from 'react'
import StoreSettingApi from './apis/store_setting'
import { NavigationMenu, Toast } from '@shopify/app-bridge-react'
import Preloader from './components/Preloader'
import Privacy from './components/Privacy'
import { Page } from '@shopify/polaris'
import LoadingPage from './components/LoadingPage'
import { AppBridgeProvider, PolarisProvider, QueryProvider } from './components'
import { BrowserRouter } from 'react-router-dom'
import AppFullscreen from './components/AppFullscreen'
import App from './App'
import ConfirmModal from './components/ConfirmModal'
import { getStoreSetting } from './redux/actions/storeSetting'

function AppContainer(props) {
  const { actions, storeSetting, notify, appLoading } = props

  const [isFullscreen, setIsFullscreen] = useState(true)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  useEffect(() => {
    console.log('-------------------------')
    console.log('App props:', props)
  }, [props])

  const getStoreSetting = async () => {
    try {
      await actions.getStoreSetting()
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    if (!storeSetting) {
      getStoreSetting()
    }
  }, [])

  const acceptPrivacy = async () => {
    try {
      actions.showAppLoading()
      await actions.updateStoreSetting({ acceptedAt: new Date().toISOString() })
      actions.showNotify({ message: 'Privacy accepted' })
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const toastMarkup = notify?.show && (
    <Toast
      error={notify.error}
      content={notify.message}
      onDismiss={() => {
        if (notify.onDismiss) {
          notify.onDismiss()
        }
        actions.hideNotify()
      }}
    />
  )

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={
                [
                  // {
                  //   label: 'Home',
                  //   destination: '/',
                  // },
                ]
              }
            />

            <AppFullscreen isFullscreen={isFullscreen}>
              <Page fullWidth={isFullscreen}>
                {storeSetting ? (
                  storeSetting?.acceptedAt ? (
                    <App
                      {...props}
                      isFullscreen={isFullscreen}
                      onToggleFullscreen={() =>
                        isFullscreen ? setOpenConfirmModal(true) : setIsFullscreen(!isFullscreen)
                      }
                    />
                  ) : (
                    <Page fullWidth>
                      <Privacy onAction={acceptPrivacy} />
                    </Page>
                  )
                ) : (
                  <Preloader />
                )}
              </Page>
            </AppFullscreen>

            {appLoading?.loading && <LoadingPage />}

            {toastMarkup}

            {openConfirmModal && (
              <ConfirmModal
                title="Are you sure you want to exit fullscreen?"
                content="Confirm to leave the fullscreen."
                discardAction={{
                  content: 'No, I want to stay',
                  onAction: () => setOpenConfirmModal(false),
                }}
                submitAction={{
                  content: 'Yes, I am sure',
                  onAction: () => {
                    setOpenConfirmModal(false)
                    setIsFullscreen(false)
                  },
                }}
              />
            )}
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  )
}

export default AppContainer
