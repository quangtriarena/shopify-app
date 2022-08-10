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
    <div style={{ margin: '2em' }}>
      <Card sectioned>
        <Stack vertical spacing="extraLoose">
          <Stack distribution="equalSpacing">
            <Stack distribution="trailing">
              {Boolean(acceptedAt) && (
                <DisplayText size="small">
                  Accepted date: {formatDateTime(acceptedAt, 'LLL')}
                </DisplayText>
              )}
            </Stack>

            <Stack distribution="trailing">
              {onAction && (
                <Button primary onClick={onAction}>
                  {acceptedAt ? 'Close' : 'Accept privacy'}
                </Button>
              )}
            </Stack>
          </Stack>

          <div>
            <DisplayText>PRIVACY POLICY</DisplayText>
          </div>
        </Stack>
      </Card>
    </div>
  )
}

export default Privacy
