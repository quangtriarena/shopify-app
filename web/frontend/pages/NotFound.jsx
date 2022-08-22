<<<<<<< HEAD
import { Card, EmptyState, Page } from '@shopify/polaris'
=======
import { Card, EmptyState } from '@shopify/polaris'
>>>>>>> 6763c1d62b0652973c3edeb3da9e6ddd815d9006
import { notFoundImage } from '../assets'

export default function NotFound() {
  return (
<<<<<<< HEAD
    <Page>
      <Card>
        <Card.Section>
          <EmptyState heading="There is no page at this address" image={notFoundImage}>
            <p>Check the URL and try again, or use the search bar to find what you need.</p>
          </EmptyState>
        </Card.Section>
      </Card>
    </Page>
=======
    <Card>
      <Card.Section>
        <EmptyState heading="There is no page at this address" image={notFoundImage}>
          <p>Check the URL and try again, or use the search bar to find what you need.</p>
        </EmptyState>
      </Card.Section>
    </Card>
>>>>>>> 6763c1d62b0652973c3edeb3da9e6ddd815d9006
  )
}
