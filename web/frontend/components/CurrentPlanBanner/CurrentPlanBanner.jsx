import { Banner } from '@shopify/polaris'

function CurrentPlanBanner(props) {
  const { storeSetting, location, navigate } = props

  if (storeSetting.appPlan !== 'BASIC') {
    return null
  }

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
          ? { content: 'Upgrade Plan', onAction: () => navigate('/plans') }
          : undefined
      }
      secondaryAction={{
        content: 'Read more about Pricing plans',
        onAction: () => navigate('/plans'),
      }}
    >
      <p>
        You are now testing Backup &amp; Duplication with up to 10 items per file. With as many
        files as you want. For unlimited time.
      </p>
    </Banner>
  )
}

export default CurrentPlanBanner
