import PropTypes from 'prop-types'
import { Button, FormLayout, OptionList, Popover, Stack } from '@shopify/polaris'
import { useState } from 'react'

MultipleSelect.propTypes = {
  label: PropTypes.any,
  value: PropTypes.array,
  error: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
}

MultipleSelect.defaultProps = {
  label: '',
  value: [],
  error: '',
  onChange: () => null,
  options: [],
}

function MultipleSelect(props) {
  const { label, options, error, onChange } = props

  const [value, setValue] = useState(props.value)
  const [active, setActive] = useState(false)

  const handleDiscard = () => {
    setActive(false)
    setValue(props.value)
  }

  const handleSubmit = () => {
    setActive(false)
    onChange(value)
  }

  const handleSelectAll = () => {
    let _value = value.length === options.length ? [] : options.map((item) => item.value)
    setValue(_value)
  }

  return (
    <Stack vertical spacing="extraTight">
      <Popover
        active={active}
        activator={
          <Button
            disclosure
            onClick={() => {
              setActive(!active)
              setValue(props.value)
            }}
          >
            {label}
          </Button>
        }
        onClose={handleDiscard}
      >
        <Popover.Pane>
          <OptionList onChange={setValue} options={options} selected={value} allowMultiple />
        </Popover.Pane>
        <Popover.Pane fixed>
          <Popover.Section>
            <Stack distribution="trailing" spacing="tight">
              <Button size="slim" onClick={handleSelectAll}>
                <div style={{ minWidth: 62 }}>
                  {value.length === options.length ? 'Clear all' : 'Select all'}
                </div>
              </Button>
              <Button size="slim" primary onClick={handleSubmit}>
                Apply
              </Button>
            </Stack>
          </Popover.Section>
        </Popover.Pane>
      </Popover>
      {Boolean(error) && <div className="color__error">{error}</div>}
    </Stack>
  )
}

export default MultipleSelect
