import { useState } from 'react'
import { Card, Heading, TextContainer, DisplayText, TextStyle } from '@shopify/polaris'
import { Toast } from '@shopify/app-bridge-react'
import { useAppQuery, useAuthenticatedFetch } from '../hooks'
import { useNavigate } from 'react-router-dom'

export function ProductsCard(props) {
  const { actions } = props

  const navigate = useNavigate()

  const emptyToastProps = { content: null }
  const [isLoading, setIsLoading] = useState(true)
  const [toastProps, setToastProps] = useState(emptyToastProps)
  const fetch = useAuthenticatedFetch()

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: '/api/products/count',
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false)
      },
    },
  })

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  )

  return (
    <>
      {toastMarkup}
      <Card
        title="Product Counter"
        sectioned
        primaryFooterAction={{
          content: 'Products page',
          onAction: () => navigate('/products'),
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>
            Sample products are created with a default title and price. You can remove them at any
            time.
          </p>
          <Heading element="h4">
            TOTAL PRODUCTS
            <DisplayText size="medium">
              <TextStyle variation="strong">{isLoadingCount ? '-' : data.data.count}</TextStyle>
            </DisplayText>
          </Heading>
        </TextContainer>
      </Card>
    </>
  )
}
