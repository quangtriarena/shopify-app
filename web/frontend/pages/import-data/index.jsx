import { Stack, Button, DisplayText, Card, Tooltip } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ImportForm from './ImportForm'
import DuplicatorApi from '../../apis/duplicator'
import DuplicatoreStore from '../../components/DuplicatorStore'
import PackagesTable from '../../components/PackagesTable'
import { RefreshMinor } from '@shopify/polaris-icons'

function ImportPage(props) {
  const { actions, storeSetting } = props

  const location = useLocation()
  const navigate = useNavigate()

  const [packages, setPackages] = useState(null)

  const getPackages = async () => {
    try {
      setPackages(null)

      let res = await DuplicatorApi.getDuplicatorPackages()
      if (!res.success) {
        throw res.error
      }

      setPackages(res.data)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    if (storeSetting.duplicator) {
      getPackages()
    } else {
      setPackages([])
    }
  }, [storeSetting])

  const handleRestore = async (item) => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorApi.import({ package: item.id, uuid: storeSetting.duplicator })
      if (!res.success) {
        throw res.error
      }

      actions.showNotify({ message: 'Process is running in background. Waiting for finnish!' })

      navigate('/history-actions')
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader {...props} title="Import data" onBack={() => navigate('/')} />

      <DuplicatoreStore {...props} />

      <Card>
        <Card.Section>
          <Stack distribution="equalSpacing" alignment="baseline">
            <DisplayText size="small">Duplicator Store Backup Packages</DisplayText>
            <Stack>
              <Tooltip content="Refresh">
                <Button
                  onClick={getPackages}
                  icon={RefreshMinor}
                  disabled={!Boolean(storeSetting.duplicator)}
                ></Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Card.Section>
        <PackagesTable
          {...props}
          items={packages}
          onRestore={(data) => handleRestore(data)}
          actions={['restore']}
        />
      </Card>
    </Stack>
  )
}

export default ImportPage
