import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Stack } from '@shopify/polaris'
import FormControl from '../../components/FormControl'

OptionForm.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func,
}

OptionForm.defaultProps = {
  formData: null,
  onChange: () => null,
}

function OptionForm(props) {
  const { formData, onChange } = props

  let valuesList = formData['values'].value.split(',').filter((item) => item)
  valuesList.push('')

  return (
    <Stack vertical alignment="fill">
      <FormControl
        {...formData['name']}
        onChange={(value) => {
          let _formData = JSON.parse(JSON.stringify(formData))
          _formData['name'] = { ..._formData['name'], value, error: '' }
          onChange(_formData)
        }}
      />

      <div style={{ marginLeft: '1em' }}>
        <Stack vertical alignment="fill">
          <div>Option values</div>
          {valuesList.map((item, index) => (
            <FormControl
              key={index}
              {...formData['values'][index]}
              value={'' + item}
              onChange={(value) => {
                let _formData = JSON.parse(JSON.stringify(formData))
                let _values = [...valuesList]
                _values[index] = value.replace(',', '')
                _formData['values'].value = String(_values)
                onChange(_formData)
              }}
            />
          ))}
        </Stack>
      </div>
    </Stack>
  )
}

export default OptionForm
