import PropTypes from 'prop-types'
import { ActionList, Button, Popover, Stack } from '@shopify/polaris'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { MaximizeMinor, MinimizeMinor, HorizontalDotsMinor } from '@shopify/polaris-icons'
import Divider from '../Divider'

AppNavigation.propTypes = {
  // ...appProps
  primaryActions: PropTypes.array,
  secondaryActions: PropTypes.array,
  secondaryMoreActions: PropTypes.object,
  isFullscreen: PropTypes.bool,
  onToggleFullscreen: PropTypes.func,
}

const INITIAL_STATE = {
  primaryActions: [],
  secondaryActions: [],
  secondaryMoreActions: null,
  isFullscreen: false,
  onToggleFullscreen: () => null,
}

function AppNavigation(props) {
  const {
    primaryActions,
    secondaryActions,
    secondaryMoreActions,
    isFullscreen,
    onToggleFullscreen,
  } = props

  const [openSecondaryMoreActions, setOpenSecondaryMoreActions] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Stack vertical spacing="tight" alignment="fill">
      <Stack.Item>
        <Stack spacing="tight">
          <Stack.Item fill>
            {primaryActions?.length > 0 && (
              <Stack spacing="tight">
                {primaryActions.map((item, index) => (
                  <Stack.Item key={index}>
                    <Button
                      key={index}
                      primary={item.primary}
                      destructive={item.destructive}
                      icon={item.icon ? item.icon : undefined}
                      onClick={() => (item.onAction ? item.onAction() : navigate(item.pathname))}
                      disabled={location.pathname === item.pathname}
                    >
                      {item.label}
                    </Button>
                  </Stack.Item>
                ))}
              </Stack>
            )}
          </Stack.Item>
          <Stack.Item fill>
            <Stack spacing="tight" distribution="trailing">
              {secondaryMoreActions && (
                <Stack.Item>
                  <Popover
                    active={openSecondaryMoreActions}
                    activator={
                      <Button
                        onClick={() => setOpenSecondaryMoreActions(!openSecondaryMoreActions)}
                        disclosure={Boolean(secondaryMoreActions.label)}
                        icon={secondaryMoreActions.label ? undefined : HorizontalDotsMinor}
                      >
                        {secondaryMoreActions.label}
                      </Button>
                    }
                    onClose={() => setOpenSecondaryMoreActions(false)}
                  >
                    <ActionList
                      actionRole="menuitem"
                      items={secondaryMoreActions.items.map((item) => ({
                        content: item.label,
                        onAction: () => {
                          if (item.onAction) {
                            item.onAction()
                          } else {
                            navigate(item.pathname)
                          }

                          setOpenSecondaryMoreActions(false)
                        },
                        disabled: location.pathname === item.pathname,
                      }))}
                    />
                  </Popover>
                </Stack.Item>
              )}
              {secondaryActions?.length > 0 && (
                <Stack.Item>
                  <Stack spacing="tight" distribution="trailing">
                    {secondaryActions.map((item, index) => (
                      <Stack.Item key={index}>
                        <Button
                          key={index}
                          primary={item.primary}
                          destructive={item.destructive}
                          icon={item.icon ? item.icon : undefined}
                          onClick={() =>
                            item.onAction ? item.onAction() : navigate(item.pathname)
                          }
                          disabled={location.pathname === item.pathname}
                        >
                          {item.label}
                        </Button>
                      </Stack.Item>
                    ))}
                  </Stack>
                </Stack.Item>
              )}
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <Button
              icon={isFullscreen ? MinimizeMinor : MaximizeMinor}
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            </Button>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        <Divider />
      </Stack.Item>
    </Stack>
  )
}

export default AppNavigation
