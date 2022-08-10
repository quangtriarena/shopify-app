import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, DisplayText, Stack } from '@shopify/polaris'
import formatDateTime from '../../helpers/formatDateTime'

Privacy.propTypes = {
  onAction: PropTypes.func,
  acceptedAt: PropTypes.string,
}

Privacy.defaultProps = {
  onAction: () => null,
  acceptedAt: null,
}

function Privacy(props) {
  const { onAction, acceptedAt } = props

  useEffect(() => {
    if (document.getElementById('no-root')) {
      document.getElementById('no-root').remove()
    }
  }, [])

  return (
    <Card sectioned>
      <Stack vertical alignmen="fill" spacing="extraLoose">
        <Stack distribution="equalSpacing">
          <Stack.Item>
            {Boolean(acceptedAt) && (
              <DisplayText size="small">
                Accepted at: {formatDateTime(acceptedAt, 'LLL')}
              </DisplayText>
            )}
          </Stack.Item>

          <Stack distribution="trailing">
            {onAction && (
              <Button primary onClick={onAction}>
                {acceptedAt ? 'Back to Home' : 'Accept privacy'}
              </Button>
            )}
          </Stack>
        </Stack>

        <DisplayText>
          <b>PRIVACY POLICY</b>
        </DisplayText>
      </Stack>
    </Card>
  )
}

export default Privacy
