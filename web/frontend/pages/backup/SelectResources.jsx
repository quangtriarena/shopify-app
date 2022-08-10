import { Card } from '@shopify/polaris'
import FormControl from '../../components/FormControl'

function SelectResources(props) {
  const { formData, onChange } = props

  return (
    <Card title={formData['resourceTypes'].label}>
      <Card.Section subdued>
        <FormControl
          {...formData['resourceTypes']}
          onChange={(value) => onChange('resourceTypes', value)}
        />
      </Card.Section>
    </Card>
  )
}

export default SelectResources
