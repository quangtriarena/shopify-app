import { Card, Page, Stack, Button, DisplayText } from '@shopify/polaris'
import SubmitionApi from '../apis/submition'
import { useLocation, useNavigate } from 'react-router-dom'
import CurrentPlanBanner from '../components/CurrentPlanBanner/CurrentPlanBanner'
import UniqueCode from '../components/UniqueCode'
import DuplicatorStore from '../components/DuplicatorStore'
import DuplicatorApi from '../apis/duplicator'
import { useEffect, useState } from 'react'
import PackagesTable from '../components/PackagesTable'

export default function HomePage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      actions.showAppLoading()

      let res = await SubmitionApi.submit()
      console.log('handleSubmit res :>> ', res)
      if (!res.success) {
        throw res.error
      }

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
      console.log('getPackages res :>> ', res)
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

  return (
    <Stack vertical alignment="fill">
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
            <Button primary onClick={() => navigate('/export-data')}>
              Create new package
            </Button>
          </Stack>
        </Card.Section>
        <PackagesTable {...props} items={packages} />
      </Card>

      <Button onClick={handleSubmit}>Submit test</Button>
    </Stack>
  )
}
