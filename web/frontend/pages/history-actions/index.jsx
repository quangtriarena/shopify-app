import { Card, Stack, Pagination, Button } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import BackgroundJobApi from '../../apis/background_job'
import { useEffect, useState } from 'react'
import MySkeletonPage from '../../components/MySkeletonPage'
import Table from './Table'
import { RefreshMinor } from '@shopify/polaris-icons'

function HistoryActionsPage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  const [backgroundJobs, setBackgroundJobs] = useState(null)

  const getBackgroundJobs = async (query) => {
    try {
      if (window.__getProgressTimeout) {
        clearTimeout(window.__getProgressTimeout)
      }

      let res = await BackgroundJobApi.find(query)
      if (!res.success) {
        throw res.error
      }

      setBackgroundJobs(res.data)

      // check running job
      let runningJob = res.data.items.find((item) => item.status === 'RUNNING')
      if (runningJob) {
        window.__getProgressTimeout = setTimeout(() => {
          getBackgroundJobs(location.search, true)
        }, 15000)
      }
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    getBackgroundJobs(location.search)

    // returned function will be called on component unmount
    return () => {
      clearTimeout(window.__getProgressTimeout)
    }
  }, [location.search])

  const handleCancel = async (canceled) => {
    try {
      actions.showAppLoading()

      let res = await BackgroundJobApi.update(canceled.id, {
        status: 'CANCELED',
        message: 'Canceled by user',
      })
      if (!res.success) {
        throw res.error
      }

      let _backgroundJobs = { ...backgroundJobs }
      _backgroundJobs.items = backgroundJobs.items.map((item) =>
        item.id === canceled.id ? res.data : item,
      )
      setBackgroundJobs(_backgroundJobs)

      actions.showNotify({ message: 'Canceled' })
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const handleDelete = async (deleted) => {
    try {
      actions.showAppLoading()

      let res = await BackgroundJobApi.delete(deleted.id)
      if (!res.success) {
        throw res.error
      }

      actions.showNotify({ message: 'Deleted' })

      getBackgroundJobs(location.search)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader {...props} title="History actions" onBack={() => navigate('/')} />

      <Card>
        <Card.Section>
          <Stack alignment="center" distribution="equalSpacing">
            <div>
              Total items: <b>{backgroundJobs?.totalItems || 'loading..'}</b>
            </div>
            <Button plain icon={RefreshMinor} onClick={() => getBackgroundJobs(location.search)} />
          </Stack>
        </Card.Section>

        <Table
          {...props}
          items={backgroundJobs?.items}
          onCancel={(item) => handleCancel(item)}
          onDelete={(item) => handleDelete(item)}
        />

        {backgroundJobs && (
          <Card.Section>
            <Stack distribution="center">
              <Pagination
                hasPrevious={backgroundJobs.page > 1}
                onPrevious={() => setSearchParams({ page: backgroundJobs.page - 1 })}
                hasNext={backgroundJobs.page < backgroundJobs.totalPages}
                onNext={() => setSearchParams({ page: backgroundJobs.page + 1 })}
              />
            </Stack>
          </Card.Section>
        )}
      </Card>
    </Stack>
  )
}

export default HistoryActionsPage
