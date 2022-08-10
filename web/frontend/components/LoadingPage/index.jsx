import { Spinner } from '@shopify/polaris'
import './styles.css'

function LoadingPage(props) {
  return (
    <div className="arc-loading">
      <div>
        <Spinner size="large" color="teal" />
      </div>
    </div>
  )
}

export default LoadingPage
