import React, { useState, useEffect } from 'react'
import { AppAside, AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

import { Providers, ProviderState } from '@microsoft/mgt-react'
import LoginPage from 'src/views/pages/LoginPage'

function useIsSignIn() {
  const [isSignIn, setIsSignIn] = useState(false)

  useEffect(() => {
    const updateState = () => {
      const provider = Providers.globalProvider
      setIsSignIn(provider && provider.state === ProviderState.SignedIn)
    }

    Providers.onProviderUpdated(updateState)
    updateState()
    return () => Providers.removeProviderUpdatedListener(updateState)
  }, [])

  return [isSignIn]
}

const DefaultLayout = () => {
  const [isSignIn] = useIsSignIn()
  return (
    <>
      <div>
        {isSignIn ? (
          <>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light dark:bg-transparent">
              <AppHeader />
              <div className="body flex-grow-1 px-3">
                <AppContent isSignIn={isSignIn} />
              </div>
              <AppFooter />
            </div>
            <AppAside />
          </>
        ) : (
          <LoginPage />
        )}
      </div>
    </>
  )
}

export default DefaultLayout
