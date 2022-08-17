import { Page, Stack, Button } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useLocation, useNavigate } from 'react-router-dom'
import SubmitionApi from '../../apis/submition'

function TestApiPage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  const onSubmit = async () => {
    let res = await SubmitionApi.create()
    console.log('SubmitionApi res :>> ', res)
  }

  return (
    <Page>
      <Stack vertical alignment="fill">
        <Stack.Item>
          <Button primary onClick={onSubmit}>
            Submit
          </Button>
        </Stack.Item>
      </Stack>
    </Page>
  )
}

export default TestApiPage
