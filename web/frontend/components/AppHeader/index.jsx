import { Badge, Button, DisplayText, Stack } from '@shopify/polaris'
import PropTypes from 'prop-types'
import { ArrowLeftMinor } from '@shopify/polaris-icons'
import numberWithCommas from '../../helpers/numberWithCommas'

AppHeader.propTypes = {
  // ...appProps,
  title: PropTypes.string,
  primaryActions: PropTypes.array,
  onBack: PropTypes.func,
}

AppHeader.defaultProps = {
  title: '',
  primaryActions: [],
  onBack: undefined,
}

/**
 *
 * @param {String} plan
 * @returns String
 */
const getBadgeStatus = (plan) => {
  switch (plan) {
    case 'PRO':
      return 'info'
      break

    case 'PLUS':
      return 'success'
      break

    default:
      return ''
      break
  }
}

function AppHeader(props) {
  const { storeSetting, title, primaryActions, onBack } = props

  return (
    <Stack>
      {onBack && (
        <Stack.Item>
          <Button icon={ArrowLeftMinor} onClick={onBack}></Button>
        </Stack.Item>
      )}
      <Stack.Item fill>
        <Stack vertical spacing="extraTight">
          <Stack spacing="tight">
            <Stack.Item>
              <DisplayText size="small">
                <b>{title}</b>
              </DisplayText>
            </Stack.Item>
            <Stack.Item>
              <Badge status={getBadgeStatus(storeSetting.appPlan)}>{storeSetting.appPlan}</Badge>
            </Stack.Item>
          </Stack>
          <div>
            Credits point: <b>{numberWithCommas(storeSetting.credits)}</b>
          </div>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        <Stack alignment="baseline" distribution="trailing">
          {primaryActions.map((item, index) => (
            <Stack.Item key={index}>
              <Button {...item}>{item.label}</Button>
            </Stack.Item>
          ))}
        </Stack>
      </Stack.Item>
    </Stack>
  )
}

export default AppHeader
