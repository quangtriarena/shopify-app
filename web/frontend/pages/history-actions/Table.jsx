import PropTypes from 'prop-types'
import { ActionList, Badge, Button, DataTable, Popover, Stack } from '@shopify/polaris'
import { MobileVerticalDotsMajor, ImagesMajor } from '@shopify/polaris-icons'
import { useState } from 'react'
import formatDateTime from '../../helpers/formatDateTime'
import ImportResult from './ImportResult'
import ConfirmModal from '../../components/ConfirmModal'

Table.propTypes = {
  // ...appProps,
  items: PropTypes.array,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
}

Table.defaultProps = {
  items: null,
  onDelete: () => null,
  onCancel: () => null,
}

const Types = {
  duplicator_export: 'Backup',
  duplicator_import: 'Restore',
}

const BadgeStatus = {
  COMPLETED: 'success',
  PENDING: 'warning',
  RUNNING: 'info',
  FAILED: 'critical',
  CANCELED: 'attention',
}

function Table(props) {
  const { items, onCancel, onDelete } = props

  const [selected, setSelected] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [canceled, setCanceled] = useState(null)
  const [restored, setRestored] = useState(null)

  let rows = []
  if (items?.length > 0) {
    rows = items.map((item, index) => [
      index + 1,
      <h3>
        <b>{Types[item.type]}</b>
      </h3>,
      <Badge status={BadgeStatus[item.status]}>
        {item.status}
        {item.status === 'RUNNING' && item.progress > 0 ? ` ${item.progress}%` : ``}
      </Badge>,
      <Stack vertical spacing="extraTight">
        {Boolean(item.type === 'duplicator_import' && item.result?.length > 0) && (
          <Stack spacing="extraTight" alignment="baseline" wrap={false}>
            <Stack.Item>Result:</Stack.Item>
            <Stack.Item>
              <Button plain onClick={() => setRestored(item)}>
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
      <Stack distribution="center">
        <Popover
          active={item.id === selected?.id}
          activator={
            <Button
              onClick={() => setSelected(selected?.id === item.id ? null : item)}
              icon={MobileVerticalDotsMajor}
              plain
            />
          }
          onClose={() => setSelected(null)}
        >
          <ActionList
            actionRole="menuitem"
            items={[
              {
                content: 'Cancel',
                onAction: () => setCanceled(item),
                disabled: !['PENDING', 'RUNNING'].includes(item.status),
              },
              {
                content: 'Delete',
                onAction: () => setDeleted(item),
                disabled: !['COMPLETED', 'FAILED', 'CANCELED'].includes(item.status),
              },
            ]}
          />
        </Popover>
      </Stack>,
    ])
  }

  return (
    <div>
      <DataTable
        headings={['No.', 'Type', 'Status', 'Advanced', 'Action']}
        columnContentTypes={['text', 'text', 'text', 'text', 'text']}
        rows={rows}
        footerContent={items ? (items.length > 0 ? undefined : 'Have no data') : 'loading..'}
      />

      {deleted && (
        <ConfirmModal
          title="Confirm delete process"
          content="Are you sure you want to delete process? This cannot be undone."
          submitAction={{
            content: 'Delete now',
            onAction: () => onDelete(deleted) & setDeleted(null),
            destructive: true,
          }}
          discardAction={{
            content: 'Discard',
            onAction: () => setDeleted(null),
          }}
        />
      )}

      {canceled && (
        <ConfirmModal
          title="Confirm cancel process"
          content={
            <div>
              <p>Process is running in background.</p>
              <p>Are you sure you want to cancel process? This cannot be undone.</p>
            </div>
          }
          submitAction={{
            content: 'Cancel now',
            onAction: () => onCancel(canceled) & setCanceled(null),
            destructive: true,
          }}
          discardAction={{
            content: 'Discard',
            onAction: () => setCanceled(null),
          }}
        />
      )}

      {restored && <ImportResult items={restored.result} onClose={() => setRestored(null)} />}
    </div>
  )
}

export default Table
