import PropTypes from 'prop-types'
import { Banner } from '@shopify/polaris'
import { useLocation, useNavigate } from 'react-router-dom'

CurrentPlanBanner.propTypes = {
  // ...appProps
}

function CurrentPlanBanner(props) {
  const { storeSetting } = props

  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Banner
      title={`Current plan: ${storeSetting.appPlan}`}
      status={
        storeSetting.appPlan === 'PRO'
          ? 'info'
          : storeSetting.appPlan === 'PLUS'
          ? 'success'
          : 'warning'
      }
      action={
        storeSetting.appPlan !== 'PLUS'
          ? { content: 'Upgrade plan', onAction: () => navigate('/plans') }
          : undefined
      }
      secondaryAction={{
        content: 'Read more about Pricing plans',
        onAction: () => navigate('/plans'),
      }}
      onDismiss={() => {}}
    >
      <p>
        You are now testing Backup &amp; Duplication with up to 10 items per file. With as many
        files as you want. For unlimited time.
      </p>
    </Banner>
  )
}

export default CurrentPlanBanner
