import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ActionList, Badge, Button, DataTable, Popover, Stack } from '@shopify/polaris'
import formatDateTime from '../../helpers/formatDateTime'
import { MobileVerticalDotsMajor, ImagesMajor } from '@shopify/polaris-icons'

PackagesTable.propTypes = {
  // ...appProps,
  items: PropTypes.array,
}

PackagesTable.defaultProps = {
  items: null,
}

const BadgeStatus = {
  COMPLETED: 'success',
  PENDING: 'warning',
  RUNNING: 'info',
  FAILED: 'critical',
  CANCELED: 'attention',
}

function PackagesTable(props) {
  const { items } = props

  const [selected, setSelected] = useState(null)

  let rows = []
  if (items?.length > 0) {
    rows = items.map((item, index) => [
      index + 1,
      item.data.name,
      item.data.desciption,
      <Badge status={BadgeStatus[item.status]}>{item.status}</Badge>,
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
            items={[
              {
                content: 'Edit',
                onAction: () => {
                  setSelected(null)
                },
              },
              {
                content: 'Delete',
                onAction: () => {
                  setSelected(null)
                },
              },
              {
                content: 'Copy',
                onAction: () => {
                  setSelected(null)
                },
              },
              {
                content: 'Archive',
                onAction: () => {
                  setSelected(null)
                },
              },
              {
                content: 'Restore',
                onAction: () => {
                  setSelected(null)
                },
              },
            ]}
          />
        </Popover>
      </Stack>,
    ])
  }

  return (
    <DataTable
      headings={['No.', 'Package Name', 'Package Description', 'Status', 'Last Updated', 'More']}
      columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
      rows={rows}
      footerContent={items ? (items?.length > 0 ? undefined : 'Have no data') : 'Loading..'}
    />
  )
}

export default PackagesTable
