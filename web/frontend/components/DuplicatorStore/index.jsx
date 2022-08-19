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
    label: 'Enter your duplicator store unique code',
    placeholder: 'xxxx-xxxx-xxxx-xxxx-xxxx',
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
  const { actions, storeSetting, duplicatorStore } = props

  const [formData, setFormData] = useState(initFormData)

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  const getDuplicatorStore = async () => {
    try {
      let res = await DuplicatorApi.getDuplicatorStore()
      if (!res.success) throw res.error

      actions.setDuplicatorStore(res.data)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    if (storeSetting.duplicator) {
      handleChange('uuid', storeSetting.duplicator)

      // get duplicator store if any
      if (!duplicatorStore) {
        getDuplicatorStore()
      }
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
      if (!res.success) throw res.error

      actions.setStoreSetting(res.data.store)
      setDuplicatorStore(res.data.duplicatorStore)

      actions.showNotify({ message: 'Saved' })
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })

      // update error
      let _formData = JSON.parse(JSON.stringify(formData))
      _formData['uuid'] = { ..._formData['uuid'], error: error.message }
      setFormData(_formData)
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Card>
      <Card.Section>
        <Stack distribution="center">
          <DisplayText size="small">Duplicator Store</DisplayText>
        </Stack>
      </Card.Section>
      <Card.Section>
        <Stack vertical alignment="fill">
          <div>{formData['uuid'].label}</div>
          <Stack>
            <Stack.Item fill>
              <FormControl
                {...formData['uuid']}
                label=""
                onChange={(value) => handleChange('uuid', value)}
              />
            </Stack.Item>
            <Button
              primary={Boolean(
                formData['uuid'].value && formData['uuid'].value !== storeSetting.duplicator,
              )}
              disabled={
                !Boolean(
                  formData['uuid'].value && formData['uuid'].value !== storeSetting.duplicator,
                )
              }
              onClick={handleSubmit}
            >
              Check Code
            </Button>
          </Stack>
        </Stack>
      </Card.Section>
      {duplicatorStore && (
        <Card.Section>
          <div>
            Duplicator store: <b className="color__link">{duplicatorStore?.shop}</b>
          </div>
        </Card.Section>
      )}
      <Card.Section subdued>
        <Stack distribution="center">
          <div className="color__note" style={{ maxWidth: 400, textAlign: 'center' }}>
            This app makes it easy to duplicate a store's content onto another, either to spin up a
            staging.
          </div>
        </Stack>
      </Card.Section>
    </Card>
  )
}

export default DuplicatoreStore
