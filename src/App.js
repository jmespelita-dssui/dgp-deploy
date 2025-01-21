import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react-pro'
import { ToastProvider } from './context/ToastContext'

import msalInstance from './msalConfig'
import { InteractionRequiredAuthError } from '@azure/msal-browser'

import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

class App extends Component {
  componentDidMount() {
    const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  const tokenRequest = {
    scopes: ["User.Read"],
    account: accounts[0],
  };

  msalInstance.acquireTokenSilent(tokenRequest)
    .then(tokenResponse => {
      console.log("Original token:", tokenResponse.accessToken);

      // Simulate expiry
      setTimeout(() => {
        console.log("Simulating token expiry...");
        msalInstance.acquireTokenSilent(tokenRequest)
          .then(newTokenResponse => {
            console.log("New token after expiry:", newTokenResponse.accessToken);
          })
          .catch(error => {
            console.error("Token refresh failed:", error);
          });
      }, 5000); // Simulate after 5 seconds
    })
    .catch(error => {
      console.error("Error fetching token:", error);
    });
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
