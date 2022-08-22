import Routes from './Routes'
import { useEffect, useState } from 'react'
import { Stack } from '@shopify/polaris'
import AppNavigation from './components/AppNavigation'

export default function App(props) {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)')

  return (
<<<<<<< HEAD
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
                {
                  label: 'Products',
                  destination: '/products',
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
                        {
                          label: 'Test Api',
                          pathname: '/test-api',
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
=======
    <Stack vertical alignment="fill">
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
        isFullscreen={props.isFullscreen}
        onToggleFullscreen={props.onToggleFullscreen}
      />

      <Routes pages={pages} props={props} />
    </Stack>
>>>>>>> 6763c1d62b0652973c3edeb3da9e6ddd815d9006
  )
}
