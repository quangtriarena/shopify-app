import {
  ActionList,
  Badge,
  Button,
  DataTable,
  Popover,
  Stack,
  Thumbnail,
  Tooltip,
} from '@shopify/polaris'
import { MobileVerticalDotsMajor, ImagesMajor } from '@shopify/polaris-icons'
import { useState } from 'react'
import formatDateTime from '../../helpers/formatDateTime'
import ImportResult from './ImportResult'

const BADGE_STATUSES = {
  PENDING: 'warning',
  RUNNING: 'info',
  COMPLETED: 'success',
  FAILED: 'critical',
  CANCELED: 'attention',
}

function Table(props) {
  const { items, onCancel, onDelete } = props

  const [selected, setSelected] = useState(null)
  const [duplicatorImportSelected, setDuplicatorImportSelected] = useState(null)

  const renderActionList = (item) => {
    let list = []

    // if (!['PENDING', 'RUNNING'].includes(item.status)) {
    //   list.push({
    //     content: 'Delete',
    //     onAction: () => {
    //       onDelete(item)
    //       setSelected(null)
    //     },
    //   })
    // }

    if (['PENDING', 'RUNNING'].includes(item.status)) {
      list.push({
        content: 'Cancel',
        onAction: () => {
          onCancel(item)
          setSelected(null)
        },
      })
    }

    if (!['PENDING', 'RUNNING'].includes(item.status)) {
      list.push({
        content: 'Delete',
        onAction: () => {
          onDelete(item)
          setSelected(null)
        },
      })
    }

    return list
  }

  const rows = items.map((item, index) => [
    index + 1,
    <h3>
      <b>{item.type}</b>
    </h3>,
    <Badge status={BADGE_STATUSES[item.status]}>
      {item.status}
      {item.status === 'RUNNING' ? ` ${item.progress}%` : ``}
    </Badge>,
    <Stack vertical spacing="extraTight">
      {Boolean(item.type === 'duplicator_export' && item.result?.Location) && (
        <Stack spacing="extraTight" alignment="baseline" wrap={false}>
          <Stack.Item>Download:</Stack.Item>
          <Stack.Item>
            <Button plain external url={item.result.Location}>
              <b>Download</b>
            </Button>
          </Stack.Item>
        </Stack>
      )}
      {Boolean(item.type === 'duplicator_import' && item.result?.length > 0) && (
        <Stack spacing="extraTight" alignment="baseline" wrap={false}>
          <Stack.Item>Result:</Stack.Item>
          <Stack.Item>
            <Button plain onClick={() => setDuplicatorImportSelected(item)}>
              <b>View details</b>
            </Button>
          </Stack.Item>
        </Stack>
      )}
      {Boolean(item.message) && (
        <Stack spacing="extraTight" alignment="baseline" wrap={false}>
          <Stack.Item>Message:</Stack.Item>
          <Stack.Item>
            <div className="color__error" style={{ maxWidth: 240, whiteSpace: 'normal' }}>
              {item.message}
            </div>
          </Stack.Item>
        </Stack>
      )}
      <Stack spacing="extraTight" alignment="baseline" wrap={false}>
        <Stack.Item>Updated at:</Stack.Item>
        <Stack.Item>
          <div className="color__note">{formatDateTime(new Date(item.updatedAt), 'LLL')}</div>
        </Stack.Item>
      </Stack>
    </Stack>,
    <Popover
      active={item.id === selected?.id}
      activator={
        <Button
          onClick={() => setSelected(selected?.id === item.id ? null : item)}
          icon={MobileVerticalDotsMajor}
          outline
        />
      }
      onClose={() => setSelected(null)}
    >
      <ActionList actionRole="menuitem" items={renderActionList(item)} />
    </Popover>,
  ])

  return (
    <div>
      <DataTable
        headings={['No.', 'Type', 'Status', 'Advanced', 'Actions']}
        columnContentTypes={['text', 'text', 'text', 'text', 'text']}
        rows={rows}
        footerContent={items.length > 0 ? undefined : 'Have no data'}
      />

      {duplicatorImportSelected && (
        <ImportResult
          items={duplicatorImportSelected.result}
          onClose={() => setDuplicatorImportSelected(null)}
        />
      )}
    </div>
  )
}

export default Table
