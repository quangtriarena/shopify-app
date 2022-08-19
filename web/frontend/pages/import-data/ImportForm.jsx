import { Button, Card, DisplayText, Stack, TextField } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import FormValidate from '../../helpers/formValidate'
import FormControl from '../../components/FormControl'

const initFormData = {
  file: {
    type: 'file',
    label: 'File (must be .zip file)',
    value: null,
    originValue: null,
    error: '',
    required: true,
    validate: {},
    allowMultiple: false,
  },
}

function ImportForm(props) {
  const { actions, onSubmit } = props

  const [formData, setFormData] = useState(initFormData)

  useEffect(() => {
    console.log('----------------------------------')
    console.log('formData')
    Object.keys(formData).forEach((key) => console.log(`| ${key}: ${formData[key]?.value}`))
  }, [formData])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData['file'] = formData['file']
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  const handleSubmit = () => {
    try {
      let data = {
        files: [formData.file.value],
      }

      onSubmit(data)
    } catch (error) {
      console.log(error)
      actions.showNotify({ error: true, message: error.message })
    }
  }

  return (
    <Stack vertical alignment="fill">
      <Card sectioned>
        <FormControl {...formData['file']} onChange={(value) => handleChange('file', value)} />
      </Card>

      <Stack distribution="trailing">
        <Button
          disabled={!Boolean(formData['file'].value)}
          primary={Boolean(formData['file'].value)}
          onClick={handleSubmit}
        >
          Import now
        </Button>
      </Stack>
    </Stack>
  )
}

export default ImportForm
