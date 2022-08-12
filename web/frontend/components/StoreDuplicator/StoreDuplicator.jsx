import PropTypes from 'prop-types'
import { Button, Card, DisplayText, Stack, TextField } from '@shopify/polaris'
import { useState } from 'react'

StoreDuplicator.propTypes = {
  // ...appProps
}

function StoreDuplicator(props) {
  const {} = props

  const [uuid, setUuid] = useState({ value: '', error: '' })

  return (
    <Card sectioned>
      <Stack vertical alignment="fill" spacing="extraLoose">
        <Stack distribution="center">
          <DisplayText size="small">
            <span style={{ textTransform: 'capitalize' }}>Store Duplicator</span>
          </DisplayText>
        </Stack>
        <Stack.Item fill>
          <Stack vertical spacing="tight">
            <Stack.Item>Enter your original store unique code:</Stack.Item>
            <Stack alignment="trailing" spacing="tight">
              <Stack.Item fill>
                <TextField
                  // label="Enter your original unique code"
                  placeholder="code"
                  value={uuid.value}
                  error={uuid.error}
                  onChange={(value) => setUuid({ value, error: '' })}
                />
              </Stack.Item>
              <Button primary={Boolean(uuid.value)} disabled={!Boolean(uuid.value)}>
                Get packages
              </Button>
            </Stack>
          </Stack>
        </Stack.Item>
        <Stack distribution="center">
          <div className="color__note" style={{ maxWidth: 400, textAlign: 'center' }}>
            This app makes it easy to duplicate a store's content onto another, either to spin up a
            staging.
          </div>
        </Stack>
      </Stack>
    </Card>
  )
}

export default StoreDuplicator
