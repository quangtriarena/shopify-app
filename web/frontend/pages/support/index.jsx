import { Stack } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useLocation, useNavigate } from 'react-router-dom'

function SupportPage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Stack vertical alignment="fill">
      <AppHeader {...props} title="Support" onBack={() => navigate('/')} />
    </Stack>
  )
}

export default SupportPage
