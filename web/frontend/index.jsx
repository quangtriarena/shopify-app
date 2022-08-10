import ReactDOM from 'react-dom'

import { store } from './redux/store.js'
import { Provider } from 'react-redux'

import App from './App'

import './styles.scss'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
)
