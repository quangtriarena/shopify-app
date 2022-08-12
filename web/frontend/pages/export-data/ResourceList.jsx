import { Card, Stack } from '@shopify/polaris'
import ResourceItem from './ResourceItem'

function ResourceList(props) {
  const { formData, onChange } = props

  return (
    <Card title="Customize resources">
      <Card.Section subdued>
        <Stack vertical alignment="fill">
          {formData.resources.map((item, index) => (
            <ResourceItem
              key={index}
              formData={item}
              onChange={(value) => {
                let _formData = JSON.parse(JSON.stringify(formData))
                let _value = JSON.parse(JSON.stringify(value))
                _formData.resources[index] = _value
                onChange(_formData)
              }}
            />
          ))}
        </Stack>
      </Card.Section>
    </Card>
  )
}

export default ResourceList
