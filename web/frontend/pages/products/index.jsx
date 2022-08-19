import {
  Badge,
  Button,
  Card,
  DataTable,
  Pagination,
  Stack,
  Tabs,
  Thumbnail,
  Tooltip,
} from '@shopify/polaris'
import { useEffect, useState } from 'react'
import ProductApi from '../../apis/product'
import AppHeader from '../../components/AppHeader'
import { ImagesMajor, EditMinor, DeleteMinor, ViewMinor } from '@shopify/polaris-icons'
import CreateForm from './CreateForm'
import ConfirmDelete from './ConfirmDelete'
import Table from './Table'
import { useSearchParams } from 'react-router-dom'
import MySkeletonPage from '../../components/MySkeletonPage'
import { generateVariantsFromOptions } from './actions'

function ProductsPage(props) {
  const { actions, location, navigate } = props

  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState(null)
  const [count, setCount] = useState(null)
  const [created, setCreated] = useState(null)
  const [deleted, setDeleted] = useState(null)

  const getProducts = async (query) => {
    try {
      actions.showAppLoading()

      let res = await ProductApi.find(query)
      if (!res.success) throw res.error

      setProducts(res.data)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  useEffect(() => {
    getProducts(location.search)
  }, [location.search])

  const getProductsCount = async () => {
    try {
      actions.showAppLoading()

      let res = await ProductApi.count()
      if (!res.success) throw res.error

      setCount(res.data.count)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  useEffect(() => {
    getProductsCount()
  }, [])

  const handleSubmit = async (formData) => {
    try {
      actions.showAppLoading()

      let options = [...formData['options']]
      options = options
        .filter((item) => item.name.value && item.values.value)
        .map((item) => ({
          name: item.name.value,
          values: item['values'].value.split(',').filter((item) => item),
        }))

      let data = {
        title: formData.title.value,
        body_html: formData.body_html.value,
      }
      if (options.length) {
        data.options = options
        data.variants = generateVariantsFromOptions(options)
      }

      console.log('data :>> ', data)

      let res = null

      if (created.id) {
        // update
        res = await ProductApi.update(created.id, data)
      } else {
        // create
        res = await ProductApi.create(data)
      }
      if (!res.success) throw res.error

      console.log('res.data :>> ', res.data)

      actions.showNotify({ message: created.id ? 'Saved' : 'Created' })

      setCreated(null)

      getProducts(location.search)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const handleDelete = async (deleted) => {
    try {
      actions.showAppLoading()

      let res = await ProductApi.delete(deleted.id)
      if (!res.success) throw res.error

      actions.showNotify({ message: 'Deleted' })

      getProducts(location.search)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  if (created) {
    return (
      <CreateForm
        {...props}
        created={created}
        onDiscard={() => setCreated(null)}
        onSubmit={(formData) => handleSubmit(formData)}
      />
    )
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Products"
        primaryActions={[
          {
            label: 'Add product',
            primary: true,
            onClick: () => setCreated({}),
          },
        ]}
        onBack={() => navigate('/')}
      />

      <Card>
        <Card.Section>
          <div>Total items: {count || 'loading..'}</div>
        </Card.Section>
        <Table
          {...props}
          items={products?.products}
          onEdit={(item) => setCreated(item)}
          onDelete={(item) => setDeleted(item)}
        />
        {products?.products?.length > 0 && (
          <Card.Section>
            <Stack distribution="center">
              <Stack.Item>
                <Pagination
                  hasPrevious={products.pageInfo.hasPrevious}
                  onPrevious={() =>
                    setSearchParams({ pageInfo: products.pageInfo.previousPageInfo })
                  }
                  hasNext={products.pageInfo.hasNext}
                  onNext={() => setSearchParams({ pageInfo: products.pageInfo.nextPageInfo })}
                />
              </Stack.Item>
            </Stack>
          </Card.Section>
        )}
      </Card>

      {deleted && (
        <ConfirmDelete
          onDiscard={() => setDeleted(null)}
          onSubmit={() => {
            handleDelete(deleted)
            setDeleted(null)
          }}
        />
      )}
    </Stack>
  )
}

export default ProductsPage
