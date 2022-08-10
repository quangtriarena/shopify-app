import { Page, Stack } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useLocation, useNavigate } from 'react-router-dom'

function SettingsPage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Page>
      <Stack vertical alignment="fill">
        <Stack.Item>
          <AppHeader
            {...props}
            title="Settings"
            primaryActions={[
              {
                label: 'Contact us',
                onClick: () => navigate('/support'),
                primary: true,
              },
            ]}
            onBack={() => navigate('/')}
          />
        </Stack.Item>
      </Stack>
    </Page>
  )
}

export default SettingsPage
