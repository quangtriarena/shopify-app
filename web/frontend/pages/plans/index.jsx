import { Banner, Button, Card, DisplayText, Stack } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import MySkeletonPage from '../../components/MySkeletonPage'
import { useEffect, useState } from 'react'
import BillingApi from '../../apis/billing'
import numberWithCommas from '../../helpers/numberWithCommas'
import PlanCard from './PlanCard'

function PlansPage(props) {
  const { actions, storeSetting, location, navigate, appBillings } = props

  const getAppBillings = async () => {
    try {
      await actions.getAppBillings()
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    if (!appBillings) {
      getAppBillings()
    }
  }, [])

  const handleSubmit = async (id) => {
    try {
      actions.showAppLoading()

      let res = await BillingApi.create(id)
      if (!res.success) throw res.error

      console.log('res.data :>> ', res.data)

      if (res.data?.confirmation_url) {
        // upgrade plan
        window.top.location.replace(res.data.confirmation_url)
      } else {
        // downgrade plan
        window.top.location.replace(`${window.BACKEND_URL}/api/auth?shop=${window.shopOrigin}`)
      }
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  let applicationCharge = null
  let currentPlan = null
  let currentPrice = 'FREE'
  let currentTime = 'Unlimited'
  if (appBillings) {
    applicationCharge = appBillings.find((item) => item.type === 'application_charge')
    currentPlan = appBillings.find((item) => item.plan === storeSetting.appPlan)
    currentPrice = currentPlan.price === 0 ? 'FREE' : `$${currentPlan.price}`
    currentTime = currentPlan.plan === 'BASIC' ? 'Unlimited' : 'month'
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Pricing plans"
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => navigate('/support'),
            primary: true,
          },
        ]}
        onBack={() => navigate('/')}
      />

      {!appBillings && <MySkeletonPage />}

      {appBillings && (
        <Stack distribution="fillEvenly">
          <Card>
            <Card.Section>
              <DisplayText size="small">
                <b>App credits</b>
              </DisplayText>
            </Card.Section>
            <Card.Section>
              <Stack distribution="equalSpacing" alignment="trailing">
                <Stack vertical spacing="extraTight">
                  <Stack alignment="baseline">
                    <DisplayText size="small">Credits point:</DisplayText>
                    <DisplayText size="small">
                      <span className="color__success">
                        <b>{numberWithCommas(applicationCharge.credits[storeSetting.appPlan])}</b>
                      </span>
                    </DisplayText>
                  </Stack>
                  <Stack alignment="baseline">
                    <DisplayText size="small">Price:</DisplayText>
                    <DisplayText size="small">
                      <span className="color__link">
                        <b>$ {numberWithCommas(applicationCharge.price[storeSetting.appPlan])}</b>
                      </span>
                    </DisplayText>
                  </Stack>
                </Stack>
                <Button primary onClick={() => handleSubmit(applicationCharge.id)}>
                  Get more credits
                </Button>
              </Stack>
            </Card.Section>
          </Card>
          <Card>
            <Card.Section>
              <DisplayText size="small">
                <b>Current plan</b>
              </DisplayText>
            </Card.Section>
            <Card.Section>
              <Stack distribution="equalSpacing" alignment="trailing">
                <Stack vertical spacing="extraTight">
                  <DisplayText size="small">
                    <span
                      className={
                        storeSetting.appPlan === 'PRO'
                          ? 'color__link'
                          : storeSetting.appPlan === 'PLUS'
                          ? 'color__success'
                          : ''
                      }
                    >
                      <b>{storeSetting.appPlan}</b>
                    </span>
                  </DisplayText>
                  <DisplayText size="small">
                    {currentPrice} / {currentTime}
                  </DisplayText>
                </Stack>
                <Button onClick={() => navigate('/support')}>Contact us</Button>
              </Stack>
            </Card.Section>
          </Card>
        </Stack>
      )}

      {appBillings && (
        <Stack distribution="fillEvenly" alignment="fill">
          {appBillings
            .filter((item) => item.id >= 2001)
            .map((item, index) => (
              <Stack.Item key={index}>
                <PlanCard {...props} item={item} onSubmit={() => handleSubmit(item.id)} />
              </Stack.Item>
            ))}
        </Stack>
      )}
    </Stack>
  )
}

export default PlansPage
