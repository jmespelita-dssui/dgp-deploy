import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'

import msalInstance from './msalConfig'

const container = document.getElementById('root')
const root = createRoot(container)

// Initialize MSAL
async function initializeMsal() {
  try {
    await msalInstance.initialize()
    console.log('MSAL initialized successfully!')
  } catch (error) {
    console.error('Error initializing MSAL:', error)
  }
}

initializeMsal()

const originalConsoleError = console.error

console.error = (message, ...args) => {
  if (typeof message === 'string' && message.includes('WebSocket connection to')) {
    // Suppress WebSocket connection errors
    return
  }
  originalConsoleError(message, ...args) // Log other errors normally
}

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
