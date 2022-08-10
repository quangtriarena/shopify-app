import Privacy from '../../components/Privacy'
import { useNavigate } from 'react-router-dom'
import { Page } from '@shopify/polaris'

function PrivacyPage(props) {
  const { storeSetting } = props

  const navigate = useNavigate()

  return (
    <Page>
      <Privacy acceptedAt={storeSetting.acceptedAt} onAction={() => navigate('/')} />
    </Page>
  )
}

export default PrivacyPage
