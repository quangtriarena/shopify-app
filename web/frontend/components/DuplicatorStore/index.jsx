import PropTypes from 'prop-types'
import { Button, Card, DisplayText, Stack, TextField } from '@shopify/polaris'
import { useState } from 'react'
import DuplicatorApi from '../../apis/duplicator'
import FormValidate from '../../helpers/formValidate'
import FormControl from '../FormControl'
import { useEffect } from 'react'

DuplicatoreStore.propTypes = {
  // ...appProps
}

const initFormData = {
  uuid: {
    type: 'password',
    label: '',
    placeholder: 'code',
    value: '',
    error: '',
    required: false,
    disabled: false,
    validate: {
      trim: true,
      required: [true, 'Required!'],
      minlength: [10, 'Too short!'],
      maxlength: [100, 'Too long!'],
    },
  },
}

function DuplicatoreStore(props) {
  const { actions, storeSetting } = props

  const [formData, setFormData] = useState(initFormData)

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  useEffect(() => {
    if (storeSetting.duplicator) {
      handleChange('uuid', storeSetting.duplicator)
    }
  }, [])

  const handleSubmit = async () => {
    try {
      const { valid, data } = FormValidate.validateForm(formData)

      if (!valid) {
        setFormData(data)

        throw new Error('Invalid form data')
      }

      actions.showAppLoading()

      let res = await DuplicatorApi.checkCode({ uuid: data['uuid'].value })
      if (!res.success) {
        throw res.error
      }

      actions.setStoreSetting(res.data)

      actions.showNotify({ message: 'Saved' })
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })

      let _formData = JSON.parse(JSON.stringify(formData))
      _formData['uuid'] = { ..._formData['uuid'], error: error.message }
      setFormData(_formData)
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Card sectioned>
      <Stack vertical alignment="fill" spacing="extraLoose">
        <Stack distribution="center">
          <DisplayText size="small">
            <span style={{ textTransform: 'capitalize' }}>Duplicator Store</span>
          </DisplayText>
        </Stack>
        <Stack.Item fill>
          <Stack vertical>
            <Stack.Item>Enter your original store unique code:</Stack.Item>
            <Stack spacing="tight">
              <Stack.Item fill>
                <FormControl
                  {...formData['uuid']}
                  onChange={(value) => handleChange('uuid', value)}
                />
              </Stack.Item>
              <Button
                primary={Boolean(formData['uuid'].value)}
                disabled={!Boolean(formData['uuid'].value)}
                onClick={handleSubmit}
              >
                Check Code
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

export default DuplicatoreStore
