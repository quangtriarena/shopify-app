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

export default function HomePage(props) {
  const { actions, storeSetting, location, navigate } = props

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
  )
}
