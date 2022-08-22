import Routes from './Routes'
import { useEffect, useState } from 'react'
import { Stack } from '@shopify/polaris'
import AppNavigation from './components/AppNavigation'

export default function App(props) {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)')

  return (
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
  )
}
