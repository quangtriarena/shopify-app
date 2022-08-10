import { Card, Page, Stack, Pagination, Button } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import BackgroundJobApi from '../../apis/background_job'
import { useEffect, useState } from 'react'
import MySkeletonPage from '../../components/MySkeletonPage'
import Table from './Table'
import ConfirmDelete from './ConfirmDelete'
import { RefreshMinor } from '@shopify/polaris-icons'

function HistoryActionsPage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  const [isReady, setIsReady] = useState(false)
  const [backgroundJobs, setBackgroundJobs] = useState(null)
  const [canceled, setCanceled] = useState(null)
  const [deleted, setDeleted] = useState(null)

  const getBackgroundJobs = async (query, hideLoading) => {
    try {
      if (window.__getProgressTimeout) {
        clearTimeout(window.__getProgressTimeout)
      }

      if (!hideLoading) {
        actions.showAppLoading()
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
    } finally {
      actions.hideAppLoading()
    }
  }

  useEffect(() => {
    getBackgroundJobs(location.search)

    // returned function will be called on component unmount
    return () => {
      clearTimeout(window.__getProgressTimeout)
    }
  }, [location.search])

  useEffect(() => {
    if (!isReady && backgroundJobs) {
      setIsReady(true)
    }
  }, [backgroundJobs])

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

  if (!isReady) {
    return <MySkeletonPage />
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="History actions"
        onBack={() => navigate('/', { replace: true })}
      />

      <Card>
        <Card.Section>
          <Stack alignment="center" distribution="equalSpacing">
            <div>
              Total items: <b>{backgroundJobs.totalItems}</b>
            </div>
            <Button plain icon={RefreshMinor} onClick={() => getBackgroundJobs(location.search)} />
          </Stack>
        </Card.Section>
        <Table
          {...props}
          items={backgroundJobs.items}
          onCancel={(item) => setCanceled(item)}
          onDelete={(item) => setDeleted(item)}
        />
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
      </Card>

      {deleted && (
        <ConfirmDelete
          onDiscard={() => setDeleted(null)}
          onSubmit={() => {
            handleDelete(deleted)
            setDeleted(null)
          }}
        />
      )}
    </Stack>
  )
}

export default HistoryActionsPage
