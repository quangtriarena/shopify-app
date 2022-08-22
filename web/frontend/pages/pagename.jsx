<<<<<<< HEAD
import { Card, Page, Layout, TextContainer, Heading } from '@shopify/polaris'
=======
import { Card, Layout, TextContainer, Heading } from '@shopify/polaris'
>>>>>>> 6763c1d62b0652973c3edeb3da9e6ddd815d9006
import { TitleBar } from '@shopify/app-bridge-react'

export default function PageName() {
  return (
    <>
      <TitleBar
        title="Page name"
        primaryAction={{
          content: 'Primary action',
          onAction: () => console.log('Primary action'),
        }}
        secondaryActions={[
          {
            content: 'Secondary action',
            onAction: () => console.log('Secondary action'),
          },
        ]}
      />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Heading>Heading</Heading>
            <TextContainer>
              <p>Body</p>
            </TextContainer>
          </Card>
          <Card sectioned>
            <Heading>Heading</Heading>
            <TextContainer>
              <p>Body</p>
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <Heading>Heading</Heading>
            <TextContainer>
              <p>Body</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
<<<<<<< HEAD
    </Page>
=======
    </>
>>>>>>> 6763c1d62b0652973c3edeb3da9e6ddd815d9006
  )
}
