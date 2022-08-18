import { useState } from 'react'
import PropTypes from 'prop-types'
import { ActionList, Badge, Button, DataTable, Popover, Stack } from '@shopify/polaris'
import formatDateTime from '../../helpers/formatDateTime'
import { MobileVerticalDotsMajor, ImagesMajor } from '@shopify/polaris-icons'
import ConfirmModal from '../ConfirmModal'

PackagesTable.propTypes = {
  // ...appProps,
  items: PropTypes.array,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
  onRestore: PropTypes.func,
  actions: PropTypes.array,
}

PackagesTable.defaultProps = {
  items: null,
  onDelete: () => null,
  onCancel: () => null,
  onRestore: () => null,
  actions: [],
}

const BadgeStatus = {
  COMPLETED: 'success',
  PENDING: 'warning',
  RUNNING: 'info',
  FAILED: 'critical',
  CANCELED: 'attention',
}

function PackagesTable(props) {
  const { items, onDelete, onCancel, onRestore, actions } = props

  const [selected, setSelected] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [canceled, setCanceled] = useState(null)
  const [restored, setRestored] = useState(null)

  const renderAction = (action, item) => {
    switch (action) {
      case 'edit':
        return {
          content: 'Edit',
          onAction: () => setSelected(null),
          disabled: !['COMPLETED', 'FAILED', 'CANCELED'].includes(item.status),
        }
        break

      case 'delete':
        return {
          content: 'Delete',
          onAction: () => setDeleted(item) & setSelected(null),
          disabled: !['COMPLETED', 'FAILED', 'CANCELED'].includes(item.status),
        }
        break

      case 'cancel':
        return {
          content: 'Cancel',
          onAction: () => setCanceled(item) & setSelected(null),
          disabled: !['PENDING', 'RUNNING'].includes(item.status),
        }
        break

      case 'copy':
        return {
          content: 'Copy',
          onAction: () => setSelected(null),
          disabled: true,
        }
        break

      case 'archive':
        return {
          content: 'Archive',
          onAction: () => setSelected(null),
          disabled: true,
        }
        break

      case 'restore':
        return {
          content: 'Restore',
          onAction: () => setRestored(item) & setSelected(null),
          disabled: item.status !== 'COMPLETED',
        }
        break

      default:
        break
    }
  }

  let rows = []
  if (items?.length > 0) {
    rows = items.map((item, index) => [
      index + 1,
      <div>
        <p>
          <b>{item.data.name}</b>
        </p>
        <p>{item.data.description}</p>
      </div>,
      <Badge status={BadgeStatus[item.status]}>{item.status}</Badge>,
      item.message,
      formatDateTime(item.updatedAt),
      <Stack distribution="center">
        <Popover
          active={item.id === selected?.id}
          activator={
            <Button
              plain
              onClick={() => setSelected(selected?.id === item.id ? null : item)}
              icon={MobileVerticalDotsMajor}
            />
          }
          onClose={() => setSelected(null)}
        >
          <ActionList
            actionRole="menuitem"
            items={actions.map((action) => renderAction(action, item))}
          />
        </Popover>
      </Stack>,
    ])
  }

  return (
    <div>
      <DataTable
        headings={['No.', 'Package', 'Status', 'Message', 'Last Updated', 'Action']}
        columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text', 'text']}
        rows={rows}
        footerContent={items ? (items?.length > 0 ? undefined : 'Have no data') : 'loading..'}
      />

      {deleted && (
        <ConfirmModal
          title="Confirm delete package"
          content="Are you sure you want to delete package? This cannot be undone."
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

      {restored && (
        <ConfirmModal
          title="Confirm restore package"
          content="Are you sure you want to restore package?"
          submitAction={{
            content: 'Restore now',
            onAction: () => onRestore(restored) & setRestored(null),
          }}
          discardAction={{
            content: 'Discard',
            onAction: () => setRestored(null),
          }}
        />
      )}
    </div>
  )
}

export default PackagesTable
