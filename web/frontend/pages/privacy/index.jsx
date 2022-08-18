import Privacy from '../../components/Privacy'
import { useNavigate } from 'react-router-dom'

function PrivacyPage(props) {
  const { storeSetting } = props

  const navigate = useNavigate()

  return <Privacy acceptedAt={storeSetting.acceptedAt} onAction={() => navigate('/')} />
}

export default PrivacyPage
