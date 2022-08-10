import { Banner, Button, Card, DisplayText, Page, Stack } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import MySkeletonPage from '../../components/MySkeletonPage'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BillingApi from '../../apis/billing'
import numberWithCommas from '../../helpers/numberWithCommas'
import PlanCard from './PlanCard'

function PlansPage(props) {
  const { actions, storeSetting } = props

  const location = useLocation()
  const navigate = useNavigate()

  const [isReady, setIsReady] = useState(false)
  const [appBillings, setAppBillings] = useState(null)

  const getAppBillings = async () => {
    try {
      actions.showAppLoading()

      let res = await BillingApi.get()
      if (!res.success) {
        throw res.error
      }

      setAppBillings(res.data)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  useEffect(() => {
    getAppBillings()
  }, [])

  useEffect(() => {
    if (!isReady && appBillings) {
      setIsReady(true)
    }
  }, [appBillings])

  const handleSubmit = async (id) => {
    try {
      actions.showAppLoading()

      let res = await BillingApi.create(id)
      if (!res.success) {
        throw res.error
      }

      if (res.data?.confirmation_url) {
        window.top.location.replace(res.data.confirmation_url)
      } else {
        window.top.location.replace(
          `${window.BACKEND_URL}?shop=${window.shopOrigin}&host=${window.host}`,
        )
      }
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  let applicationCharge = null
  let currentPlan = null
  let planPrice = 'FREE'
  let planTime = 'Unlimited'
  if (appBillings) {
    applicationCharge = appBillings.find((item) => item.type === 'application_charge')
    currentPlan = appBillings.find((item) => item.plan === storeSetting.appPlan)
    planPrice = currentPlan.price === 0 ? 'FREE' : `$${currentPlan.price}`
    planTime = currentPlan.plan === 'BASIC' ? 'Unlimited' : 'month'
  }

  if (!isReady) {
    return <MySkeletonPage />
  }

  return (
    <Page>
      <Stack vertical alignment="fill">
        <Stack.Item>
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
        </Stack.Item>

        <Stack distribution="fillEvenly">
          <Card>
            <Card.Section>
              <DisplayText size="small">
                <b>App credits</b>
              </DisplayText>
            </Card.Section>
            <Card.Section>
              <Stack distribution="equalSpacing" alignment="trailing">
                <Stack vertical spacing="tight">
                  <Stack alignment="baseline">
                    <div style={{ minWidth: 120 }}>
                      <DisplayText size="small">Credits point:</DisplayText>
                    </div>
                    <DisplayText size="small">
                      <span style={{ color: 'var(--successColor)' }}>
                        <b>{numberWithCommas(applicationCharge.credits[storeSetting.appPlan])}</b>
                      </span>
                    </DisplayText>
                  </Stack>
                  <Stack alignment="baseline">
                    <div style={{ minWidth: 120 }}>
                      <DisplayText size="small">Price:</DisplayText>
                    </div>
                    <DisplayText size="small">
                      <span style={{ color: 'var(--linkColor)' }}>
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
                <Stack vertical spacing="tight">
                  <DisplayText size="small">
                    <span
                      style={{
                        color:
                          storeSetting.appPlan === 'PRO'
                            ? 'var(--linkColor)'
                            : storeSetting.appPlan === 'PLUS'
                            ? 'var(--successColor)'
                            : 'unset',
                      }}
                    >
                      <b>{storeSetting.appPlan}</b>
                    </span>
                  </DisplayText>
                  <DisplayText size="small">
                    {planPrice} / {planTime}
                  </DisplayText>
                </Stack>
                <Button onClick={() => navigate('/support')}>Contact us</Button>
              </Stack>
            </Card.Section>
          </Card>
        </Stack>

        <Stack distribution="fillEvenly" alignment="fill">
          {appBillings
            .filter((item) => item.id >= 2001)
            .map((item, index) => (
              <Stack.Item key={index}>
                <PlanCard {...props} item={item} onSubmit={() => handleSubmit(item.id)} />
              </Stack.Item>
            ))}
        </Stack>
      </Stack>
    </Page>
  )
}

export default PlansPage
