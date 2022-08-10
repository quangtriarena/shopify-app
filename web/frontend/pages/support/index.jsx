import { Page, Stack } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useLocation, useNavigate } from 'react-router-dom'

function SupportPage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Page>
      <Stack vertical alignment="fill">
        <Stack.Item>
          <AppHeader {...props} title="Support" onBack={() => navigate('/')} />
        </Stack.Item>
      </Stack>
    </Page>
  )
}

export default SupportPage
