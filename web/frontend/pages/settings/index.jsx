import { Stack } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useLocation, useNavigate } from 'react-router-dom'

function SettingsPage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Stack vertical alignment="fill">
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
    </Stack>
  )
}

export default SettingsPage
