import React, { Component, Suspense, useEffect } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react-pro'
import { ToastProvider } from './context/ToastContext'

import msalInstance from './msalConfig'
import { InteractionRequiredAuthError } from '@azure/msal-browser'

import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

class App extends Component {
  componentDidMount() {
    // Clean MSAL fragments after redirect
    if (window.location.search.includes('code=')) {
      window.history.replaceState({}, document.title, '/')
    }

    const account = msalInstance.getActiveAccount() // Get the logged-in user's account

    if (account) {
      const request = {
        scopes: [
          'calendars.read',
          'user.read',
          'openid',
          'profile',
          'people.read',
          'user.readbasic.all',
          'presence.read',
          'user.readwrite',
          'group.read.all',
          'directory.read.all',
        ], // Replace with your app's required scopes
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
      msalInstance.loginRedirect({ scopes: ['User.Read'] })
      // console.warn('No active account found. User may not be logged in.')
    }
  }

  render() {
    return (
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<CSpinner color="primary" />}>
            <Routes>
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    )
  }
}

export default App
