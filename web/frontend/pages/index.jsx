import { Card, Stack, Button, DisplayText, Tooltip } from '@shopify/polaris'
import SubmitionApi from '../apis/submition'
import { useLocation, useNavigate } from 'react-router-dom'
import CurrentPlanBanner from '../components/CurrentPlanBanner/CurrentPlanBanner'
import UniqueCode from '../components/UniqueCode'
import DuplicatorStore from '../components/DuplicatorStore'
import DuplicatorApi from '../apis/duplicator'
import { useEffect, useState } from 'react'
import PackagesTable from '../components/PackagesTable'
import { RefreshMinor } from '@shopify/polaris-icons'
import AppHeader from '../components/AppHeader'

export default function HomePage(props) {
  const { actions, storeSetting } = props

  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    console.log('handleSubmit')
    try {
      actions.showAppLoading()

      let res = await SubmitionApi.submit()
      if (!res.success) {
        throw res.error
      }

      console.log('res.data :>> ', res.data)

      actions.showNotify({ message: 'Submition successful' })
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const [packages, setPackages] = useState(null)

  const getPackages = async () => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorApi.getPackages()
      if (!res.success) {
        throw res.error
      }

      setPackages(res.data)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  useEffect(() => {
    getPackages()
  }, [])

  const handleDelete = async (deleted) => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorApi.delete(deleted.id)
      if (!res.success) {
        throw res.error
      }

      let _package = packages.filter((item) => item.id !== deleted.id)
      setPackages(_package)

      actions.showNotify({ message: 'Deleted' })
    } catch (error) {
      console.log(error)
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
      if (!res.success) {
        throw res.error
      }

      let _package = packages.map((item) => (item.id === canceled.id ? res.data : item))
      setPackages(_package)

      actions.showNotify({ message: 'Canceled' })
    } catch (error) {
      console.log(error)
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

      <Stack distribution="fillEvenly" alignment="fill">
        <Stack.Item fill>
          <UniqueCode {...props} />
        </Stack.Item>
        <Stack.Item fill>
          <DuplicatorStore {...props} />
        </Stack.Item>
      </Stack>

      <Card>
        <Card.Section>
          <Stack distribution="equalSpacing" alignment="baseline">
            <DisplayText size="small">Your Backup Packages</DisplayText>
            <Stack>
              <Tooltip content="Refresh">
                <Button onClick={getPackages} icon={RefreshMinor}></Button>
              </Tooltip>
              <Button primary onClick={() => navigate('/export-data')}>
                Create new package
              </Button>
            </Stack>
          </Stack>
        </Card.Section>
        <PackagesTable
          {...props}
          items={packages}
          actions={['edit', 'delete', 'cancel', 'copy', 'archive', 'restore']}
          onDelete={(item) => handleDelete(item)}
          onCancel={(item) => handleCancel(item)}
        />
      </Card>

      {/* <Button onClick={handleSubmit}>Submit test</Button> */}
    </Stack>
  )
}
