import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'

import { Providers } from '@microsoft/mgt-element'
import { Msal2Provider } from '@microsoft/mgt-msal2-provider'

import config from './config'

const container = document.getElementById('root')
const root = createRoot(container)

Providers.globalProvider = new Msal2Provider({
  clientId: 'b781906d-dabc-418d-b1e6-cca04e3ad35f',
  scopes: [
    'calendars.read',
    'user.read',
    'openid',
    'profile',
    'people.read',
    'user.readbasic.all',
    'presence.read',
    'user.readwrite',
  ],
})

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
