import { Button, Card, Collapsible, Stack } from '@shopify/polaris'
import { useState } from 'react'
import FormControl from '../../components/FormControl'
import { ChevronLeftMinor, ChevronDownMinor } from '@shopify/polaris-icons'

function ResourceItem(props) {
  const { formData, onChange } = props

  const [open, setOpen] = useState(false)

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    onChange(_formData)
  }

  return (
    <div>
      <Card>
        <Card.Section>
          <Stack distribution="equalSpacing" alignment="center">
            <Stack.Item>
              <b>{formData.type.value.replace(/_/g, ' ').toUpperCase()}</b>
            </Stack.Item>
            <Stack.Item>
              <Button
                plain
                icon={open ? ChevronDownMinor : ChevronLeftMinor}
                onClick={() => setOpen(!open)}
              />
            </Stack.Item>
          </Stack>
        </Card.Section>
        <Collapsible
          open={open}
          id="basic-collapsible"
          transition={{ duration: '100ms', timingFunction: 'ease-in-out' }}
          expandOnPrint
        >
          <Card.Section subdued>
            <Card>
              <Card.Section title="Resource">
                <Stack vertical>
                  <Stack distribution="fillEvenly">
                    <Stack.Item fill>
                      <FormControl
                        {...formData['count']}
                        onChange={(value) => handleChange('count', value)}
                      />
                    </Stack.Item>
                    <Stack.Item fill></Stack.Item>
                  </Stack>
                </Stack>
              </Card.Section>
              <Card.Section title="Select columns (All columns)"></Card.Section>
              <Card.Section title="Filters (All resources)"></Card.Section>
            </Card>
          </Card.Section>
        </Collapsible>
      </Card>
    </div>
  )
}

export default ResourceItem
