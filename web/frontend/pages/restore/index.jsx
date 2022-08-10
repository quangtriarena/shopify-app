import { Page, Stack, Button } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ImportForm from './ImportForm'
import DuplicatorApi from '../../apis/duplicator'

function RestorePage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  const handleImport = async (data) => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorApi.import(data)
      if (!res.success) {
        throw res.error
      }

      actions.showNotify({ message: 'Process is running in background. Waiting for finnish!' })

      navigate('/history-actions', { replace: true })
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Page>
      <Stack vertical alignment="fill">
        <AppHeader {...props} title="Import data" onBack={() => navigate('/', { replace: true })} />

        <ImportForm {...props} onSubmit={(formData) => handleImport(formData)} />
      </Stack>
    </Page>
  )
}

export default RestorePage
