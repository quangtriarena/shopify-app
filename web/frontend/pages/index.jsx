<<<<<<< HEAD
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  Button,
} from '@shopify/polaris'
import { TitleBar } from '@shopify/app-bridge-react'

import { trophyImage } from '../assets'

import { ProductsCard } from '../components'

import { useLocation, useNavigate } from 'react-router-dom'
import CurrentPlanBanner from '../components/CurrentPlanBanner/CurrentPlanBanner'
=======
import { Card, Stack, Button, DisplayText, Tooltip } from '@shopify/polaris'
import SubmitionApi from '../apis/submition'
import CurrentPlanBanner from '../components/CurrentPlanBanner/CurrentPlanBanner'
import UniqueCode from '../components/UniqueCode'
import DuplicatorStore from '../components/DuplicatorStore'
import DuplicatorApi from '../apis/duplicator'
import { useEffect, useState } from 'react'
import PackagesTable from '../components/PackagesTable'
import { RefreshMinor } from '@shopify/polaris-icons'
import AppHeader from '../components/AppHeader'
import Intro from '../components/Intro'
>>>>>>> 6763c1d62b0652973c3edeb3da9e6ddd815d9006

export default function HomePage(props) {
  const { actions, storeSetting, location, navigate } = props

<<<<<<< HEAD
  return (
    <Page narrowWidth>
      {/* <TitleBar title="App name" primaryAction={null} /> */}

      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack wrap={false} spacing="extraTight" distribution="trailing" alignment="center">
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Heading>Nice work on building a Shopify app 🎉</Heading>
                  <p>
                    Your app is ready to explore! It contains everything you need to get started
                    including the{' '}
                    <Link url="https://polaris.shopify.com/" external>
                      Polaris design system
                    </Link>
                    ,{' '}
                    <Link url="https://shopify.dev/api/admin-graphql" external>
                      Shopify Admin API
                    </Link>
                    , and{' '}
                    <Link url="https://shopify.dev/apps/tools/app-bridge" external>
                      App Bridge
                    </Link>{' '}
                    UI library and components.
                  </p>
                  <p>
                    Ready to go? Start populating your app with some sample products to view and
                    test in your store.{' '}
                  </p>
                  <p>
                    Learn more about building out your app in{' '}
                    <Link url="https://shopify.dev/apps/getting-started/add-functionality" external>
                      this Shopify tutorial
                    </Link>{' '}
                    📚{' '}
                  </p>
                </TextContainer>
              </Stack.Item>
              <Stack.Item>
                <div style={{ padding: '0 20px' }}>
                  <Image
                    source={trophyImage}
                    alt="Nice work on building a Shopify app"
                    width={120}
                  />
                </div>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <ProductsCard {...props} />
        </Layout.Section>
      </Layout>
    </Page>
=======
  const handleSubmit = async () => {
    console.log('handleSubmit')
    try {
      actions.showAppLoading()

      let res = await SubmitionApi.submit()
      if (!res.success) throw res.error

      console.log('res.data :>> ', res.data)

      actions.showNotify({ message: 'Submition successful' })
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const [packages, setPackages] = useState(null)

  const getPackages = async () => {
    try {
      setPackages(null)

      let res = await DuplicatorApi.getPackages()
      if (!res.success) throw res.error

      setPackages(res.data)
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    getPackages()
  }, [])

  const handleDelete = async (deleted) => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorApi.delete(deleted.id)
      if (!res.success) throw res.error

      let _package = packages.filter((item) => item.id !== deleted.id)
      setPackages(_package)

      actions.showNotify({ message: 'Deleted' })
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const handleCancel = async (canceled) => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorApi.update(canceled.id, {
        status: 'CANCELED',
        message: 'Canceled by user',
      })
      if (!res.success) throw res.error

      let _package = packages.map((item) => (item.id === canceled.id ? res.data : item))
      setPackages(_package)

      actions.showNotify({ message: 'Canceled' })
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Home"
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => navigate('/support'),
            primary: true,
          },
        ]}
      />

      <CurrentPlanBanner {...props} />

      <Intro />

      {/* <Button onClick={handleSubmit}>Submit test</Button> */}
    </Stack>
>>>>>>> 6763c1d62b0652973c3edeb3da9e6ddd815d9006
  )
}
