import { useState } from 'react'
import PropTypes from 'prop-types'
import { Badge, Card, Modal, Stack, Tabs } from '@shopify/polaris'

ImportResult.propTypes = {
  items: PropTypes.array,
  onClose: PropTypes.func,
}

ImportResult.defaultProps = {
  items: [],
  onClose: () => null,
}

function ImportResult(props) {
  const { items, onClose } = props

  const [selected, setSelected] = useState(0)

  return (
    <Modal
      large
      open={true}
      onClose={onClose}
      title="Import result"
      secondaryActions={[
        {
          content: 'Close',
          onAction: onClose,
        },
      ]}
    >
      <Tabs
        tabs={items.map((item) => ({
          id: item.type,
          content: item.type.replace(/_/g, ' ').toUpperCase(),
          accessibilityLabel: item.type.replace(/_/g, ' ').toUpperCase(),
          panelID: item.type,
        }))}
        selected={selected}
        onSelect={(index) => setSelected(index)}
        fitted
      >
        <Card sectioned>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9em' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f1f1' }}>
                <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>ID</th>
                <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Handle</th>
                <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Status</th>
                <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {items[selected].result.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: '1px solid #dcdcdc',
                      padding: '0.5em 1em',
                      textAlign: 'center',
                    }}
                  >
                    {item.id}
                  </td>
                  <td style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
                    {item.handle}
                  </td>
                  <td
                    style={{
                      border: '1px solid #dcdcdc',
                      padding: '0.5em 1em',
                      textAlign: 'center',
                    }}
                  >
                    <Badge status={item.success ? 'success' : 'critical'}>
                      {item.success ? 'success' : 'failed'}
                    </Badge>
                  </td>
                  <td style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
                    {item.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Tabs>
    </Modal>
  )
}

export default ImportResult
