import { Stack, Button } from '@shopify/polaris'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import ExportForm from './ExportForm'
import DuplicatorApi from '../../apis/duplicator'

function ExportPage(props) {
  const { actions } = props

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let htmlEls = document.getElementsByTagName('HTML')
    Array.from(htmlEls).forEach((el) => (el.style.overflowY = 'scroll'))
    return () => {
      Array.from(htmlEls).forEach((el) => (el.style.overflowY = 'auto'))
    }
  }, [])

  const handlExport = async (data) => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorApi.export(data)
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
      <AppHeader {...props} title="Export data" onBack={() => navigate('/')} />

      <ExportForm {...props} onSubmit={(data) => handlExport(data)} />
    </Stack>
  )
}

export default ExportPage
