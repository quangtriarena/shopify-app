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

import SubmitionApi from '../apis/submition'
import { useLocation, useNavigate } from 'react-router-dom'
import CurrentPlanBanner from '../components/CurrentPlanBanner/CurrentPlanBanner'
import UniqueCode from '../components/UniqueCode'
import DuplicatorStore from '../components/DuplicatorStore'

export default function HomePage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      actions.showAppLoading()

      let res = await SubmitionApi.submit()
      console.log('SubmitionApi res :>> ', res)
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

      <Button onClick={handleSubmit}>Submit test</Button>
    </Stack>
  )
}
