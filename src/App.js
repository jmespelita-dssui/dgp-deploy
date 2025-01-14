import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react-pro'
import { ToastProvider } from './context/ToastContext'

import msalInstance from './msalConfig'
import { InteractionRequiredAuthError } from '@azure/msal-browser'

import './scss/style.scss'
import MyTasks from './views/pratiche/MyTasks'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

class App extends Component {
  componentDidMount() {
    const account = msalInstance.getActiveAccount() // Get the logged-in user's account

    if (account) {
      const request = {
        scopes: ['User.Read'], // Replace with your app's required scopes
        account: account,
      }

      // Attempt silent token acquisition
      msalInstance.acquireTokenSilent(request).catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          // Redirect if user interaction is required
          msalInstance.acquireTokenRedirect(request)
        } else {
          console.error('Token acquisition error:', error)
        }
      })
    } else {
      console.warn('No active account found. User may not be logged in.')
    }
  }

  render() {
    return (
      <ToastProvider>
        <HashRouter>
          <Suspense fallback={<CSpinner color="primary" />}>
            <Routes>
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </ToastProvider>
    )
  }
}

export default App
