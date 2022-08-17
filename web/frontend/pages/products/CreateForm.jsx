import PropTypes from 'prop-types'
import { Button, Card, Stack, TextField } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import FormValidate from '../../helpers/formValidate'
import MyDropZoneMultiple from '../../components/MyDropZoneMultiple'
import FormControl from '../../components/FormControl'

CreateForm.propTypes = {
  created: PropTypes.object,
  onDiscard: PropTypes.func,
  onSubmit: PropTypes.func,
}

CreateForm.defaultProps = {
  created: {},
  onDiscard: () => null,
  onSubmit: () => null,
}

const initialFormData = {
  title: {
    type: 'text',
    label: 'Title',
    value: '',
    error: '',
    required: true,
    validate: {
      trim: true,
      required: [true, 'Required!'],
      minlength: [2, 'Too short!'],
      maxlength: [200, 'Too long!'],
    },
    autoFocus: true,
  },

  body_html: {
    type: 'text',
    label: 'Description',
    value: '',
    error: '',
    required: true,
    validate: {
      trim: true,
      required: [true, 'Required!'],
      minlength: [2, 'Too short!'],
    },
    multiline: 6,
    autoFocus: true,
  },

  images: {
    type: 'file',
    label: 'Images Products',
    value: [],
    originValue: [],
    error: '',
    validate: {},
    allowMultiple: true,
  },

  // vendor: {
  //   type: 'select',
  //   label: 'Vendor',
  //   value: '',
  //   error: '',
  //   validate: {},
  //   options: [{ label: 'Select a vendor', value: '' }],
  // },
}

function CreateForm(props) {
  const { actions, created, onDiscard, onSubmit } = props

  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => console.log('formData', formData), [formData])

  useEffect(() => {
    let _formData = JSON.parse(JSON.stringify(initialFormData))

    /**
     * test
     */
    _formData.title.value = `Sample product`
    _formData.body_html.value = `Sample product`

    if (created.id) {
      Array.from(['title', 'body_html']).map(
        (key) => (_formData[key] = { ..._formData[key], value: created[key] || '' }),
      )
    }

    setFormData(_formData)
  }, [])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))

    Array.from(['images']).forEach((key) => (_formData[key] = formData[key]))
    _formData[name] = { ..._formData[name], value, error: '' }

    setFormData(_formData)
  }

  const handleSubmit = () => {
    try {
      const { valid, data } = FormValidate.validateForm(formData)

      if (valid) {
        data['images'].value = formData['images'].value
        onSubmit(data)
      } else {
        setFormData(data)

        throw new Error('Invalid form data')
      }
    } catch (error) {
      console.log(error)
      actions.showNotify({ error: true, message: error.message })
    }
  }

  return (
    <Stack vertical alignment="fill">
      <Stack.Item>
        <AppHeader
          {...props}
          title={created.id ? 'Update product' : 'Add product'}
          onBack={onDiscard}
        />
      </Stack.Item>

      <Stack.Item>
        <Card sectioned>
          <Stack vertical alignment="fill">
            <FormControl
              {...formData['title']}
              onChange={(value) => handleChange('title', value)}
            />

            <FormControl
              {...formData['body_html']}
              onChange={(value) => handleChange('body_html', value)}
            />

            {/* <FormControl
              {...formData['vendor']}
              onChange={(value) => handleChange('vendor', value)}
            /> */}

            <FormControl
              {...formData['images']}
              onChange={(value) => handleChange('images', value)}
            />
          </Stack>
        </Card>
      </Stack.Item>

      <Stack.Item>
        <Stack distribution="trailing">
          <Button onClick={onDiscard}>Discard</Button>
          <Button primary onClick={handleSubmit}>
            {created.id ? 'Save' : 'Add'}
          </Button>
        </Stack>
      </Stack.Item>
    </Stack>
  )
}

export default CreateForm
