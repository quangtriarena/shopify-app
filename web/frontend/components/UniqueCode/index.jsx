import PropTypes from 'prop-types'
import { Button, Card, DisplayText, Stack } from '@shopify/polaris'
import { useState } from 'react'
import { useCopyToClipboard } from '../../hooks'

UniqueCode.propTypes = {
  // ...appProps
}

function UniqueCode(props) {
  const { storeSetting, actions } = props

  const [lockCode, setLockCode] = useState(true)

  return (
    <Card sectioned>
      <Stack vertical alignment="fill" spacing="extraLoose">
        <Stack distribution="center">
          <DisplayText size="small">
            <span style={{ textTransform: 'capitalize' }}>Your Store Unique Code</span>
          </DisplayText>
        </Stack>
        <Stack vertical alignment="center">
          <Stack distribution="center">
            <div className="color__error">
              {lockCode ? storeSetting.uuid.replace(/./g, '*') : storeSetting.uuid}
            </div>
          </Stack>
          <Stack distribution="center">
            <Button
              primary
              onClick={() =>
                useCopyToClipboard(storeSetting.uuid)
                  ? actions.showNotify({ message: 'Copied' })
                  : actions.showNotify({ message: '#Error', error: true })
              }
            >
              Copy
            </Button>
            <Button onClick={() => setLockCode(!lockCode)}>
              {lockCode ? 'Unlock Code' : 'Lock Code'}
            </Button>
          </Stack>
        </Stack>
        <Stack distribution="center">
          <div className="color__note" style={{ maxWidth: 400, textAlign: 'center' }}>
            Share this unique key with child-stores so that you can import packages to your
            child-stores.
          </div>
        </Stack>
      </Stack>
    </Card>
  )
}

export default UniqueCode
