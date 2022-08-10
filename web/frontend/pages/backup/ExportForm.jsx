import { Button, Card, DisplayText, Stack, TextField } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import FormValidate from '../../helpers/formValidate'
import SelectResources from './SelectResources'
import ResourceList from './ResourceList'

const ResourceTypes = ['product', 'custom_collection', 'smart_collection']

const ResourceFormData = {
  type: {
    type: 'text',
    label: 'Type',
    value: '',
    error: '',
    required: true,
    validate: {},
  },
  count: {
    type: 'select',
    label: 'Count',
    value: '5',
    error: '',
    required: true,
    validate: {},
    options: [
      { label: '5 (test)', value: '5' },
      { label: '20', value: '20' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
      { label: '200', value: '200' },
      { label: '500', value: '500' },
      { label: '1000', value: '1000' },
      { label: 'All', value: 'all' },
    ],
  },
}

const ResourceListFormData = [...ResourceTypes].map((item) => ({
  ...ResourceFormData,
  type: { ...ResourceFormData.type, value: item },
}))

const initFormData = {
  resourceTypes: {
    type: 'multiple-select',
    label: 'Select resources',
    value: [...ResourceTypes],
    error: '',
    required: true,
    validate: {},
    options: [...ResourceTypes].map((item) => ({ label: item.replace(/_/g, ' '), value: item })),
  },
  resources: [...ResourceListFormData],
}

function ExportForm(props) {
  const { actions, onSubmit } = props

  const [formData, setFormData] = useState(initFormData)

  useEffect(() => {
    console.log(`-----------------------------`)
    console.log('formData :>> ', formData)
    Object.keys(formData)
      .filter((key) => !['resources'].includes(key))
      .forEach((key) => console.log(`| ${key}: ${formData[key]?.value}`))

    if (formData.resources) {
      console.log(`| resources:`)
      formData.resources.forEach((item) => {
        console.log(`\t| ${item.type.value}`)
        Object.keys(item).forEach((key) => console.log(`\t\t| ${key}: ${item[key]?.value}`))
      })
    }
  }, [formData])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }

    if (name === 'resourceTypes') {
      _formData['resources'] = value.map((item) => ({
        ...ResourceFormData,
        type: { ...ResourceFormData.type, value: item },
      }))
    }

    setFormData(_formData)
  }

  const handleSubmit = () => {
    try {
      const data = {
        resources: formData.resources.map((item) => {
          let obj = {}
          Object.keys(item).forEach((key) =>
            item[key].value ? (obj[key] = item[key].value) : null
          )
          return obj
        }),
      }

      onSubmit(data)
    } catch (error) {
      console.log(error)
      actions.showNotify({ error: true, message: error.message })
    }
  }

  return (
    <Stack vertical>
      <SelectResources formData={formData} onChange={handleChange} />

      {formData.resources.length > 0 && <ResourceList formData={formData} onChange={setFormData} />}

      <Stack distribution="trailing">
        <Button
          disabled={!Boolean(formData.resources?.length > 0)}
          primary={Boolean(formData.resources?.length > 0)}
          onClick={handleSubmit}
        >
          Export now
        </Button>
      </Stack>
    </Stack>
  )
}

export default ExportForm
