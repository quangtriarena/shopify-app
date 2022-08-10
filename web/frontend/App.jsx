import { BrowserRouter } from 'react-router-dom'
import { NavigationMenu, Toast } from '@shopify/app-bridge-react'
import Routes from './Routes'
import { useEffect, useState } from 'react'
import { FullscreenBar, Modal, Stack, TextContainer } from '@shopify/polaris'

import { AppBridgeProvider, QueryProvider, PolarisProvider } from './components'

import { useSelector, useDispatch } from 'react-redux'
import { hideNotify, selectNotify, showNotify } from './redux/reducers/notify'
import { hideAppLoading, selectAppLoading, showAppLoading } from './redux/reducers/appLoading'
import { selectStoreSetting, setStoreSetting } from './redux/reducers/storeSetting'

import AppContainer from './AppContainer'
import AppNavigation from './components/AppNavigation'
import AppFullscreen from './components/AppFullscreen'
import LoadingPage from './components/LoadingPage'

export default function App(props) {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)')

  const dispatch = useDispatch()

  const appLoading = useSelector(selectAppLoading)
  const notify = useSelector(selectNotify)
  const storeSetting = useSelector(selectStoreSetting)

  const reduxState = { appLoading, notify, storeSetting }
  const reduxActions = {
    showAppLoading: () => dispatch(showAppLoading()),
    hideAppLoading: () => dispatch(hideAppLoading()),

    showNotify: (notify) => dispatch(showNotify(notify)),
    hideNotify: () => dispatch(hideNotify()),

    setStoreSetting: (storeSetting) => dispatch(setStoreSetting(storeSetting)),
  }

  const appProps = {
    ...reduxState,
    actions: reduxActions,
  }

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [openConfirmCloseFullscreen, setOpenConfirmCloseFullscreen] = useState(false)

  const toastMarkup = notify?.show && (
    <Toast
      error={notify.error}
      content={notify.message}
      onDismiss={() => {
        if (notify.onDismiss) {
          notify.onDismiss()
        }
        dispatch(hideNotify())
      }}
    />
  )

  const confirmCloseFullscreen = openConfirmCloseFullscreen && (
    <Modal
      open={true}
      onClose={() => setOpenConfirmCloseFullscreen(false)}
      title="Are you sure you want to exit fullscreen?"
      secondaryActions={[
        {
          content: 'No, I want to stay',
          onAction: () => setOpenConfirmCloseFullscreen(false),
          primary: true,
        },
        {
          content: 'Yes, I am sure',
          onAction: () => {
            setOpenConfirmCloseFullscreen(false)
            setIsFullscreen(false)
          },
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>Confirm to leave the fullscreen.</p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  )

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: 'Home',
                  destination: '/',
                },
              ]}
            />

            <AppContainer {...appProps}>
              <AppFullscreen isFullscreen={isFullscreen}>
                <Stack vertical>
                  <Stack.Item fill>
                    <AppNavigation
                      primaryActions={[
                        {
                          label: 'Home',
                          pathname: '/',
                        },
                        {
                          label: 'Products',
                          pathname: '/products',
                        },
                      ]}
                      secondaryActions={[
                        {
                          label: 'Pricing plans',
                          pathname: '/plans',
                        },
                      ]}
                      secondaryMoreActions={{
                        items: [
                          { label: 'Settings', pathname: '/settings' },
                          { label: 'Support', pathname: '/support' },
                          { label: 'Privacy', pathname: '/privacy' },
                        ],
                      }}
                      isFullscreen={isFullscreen}
                      onToggleFullscreen={() =>
                        isFullscreen
                          ? setOpenConfirmCloseFullscreen(true)
                          : setIsFullscreen(!isFullscreen)
                      }
                    />
                  </Stack.Item>
                  <Stack.Item fill>
                    <Routes pages={pages} appProps={appProps} />
                  </Stack.Item>
                </Stack>
              </AppFullscreen>
            </AppContainer>

            {appLoading?.loading && <LoadingPage />}

            {toastMarkup}

            {confirmCloseFullscreen}
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  )
}
