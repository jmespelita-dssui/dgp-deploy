import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react-pro'

// routes config
import routes from '../routes'
import { checkUserRole } from 'src/services/accessService'
import { getCurrentUser } from 'src/services/userService'

const AppContent = () => {
  const [loading, setLoading] = React.useState(true)
  const [role, setRole] = React.useState('')

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await getCurrentUser()
        const userRole = await checkUserRole(currentUser.azureactivedirectoryobjectid)
        setRole(userRole)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  if (loading) {
    return (
      <CContainer className="p-5">
        <CSpinner color="primary" variant="grow" className="m-3" />
        <CSpinner color="primary" variant="grow" className="m-3" />
        <CSpinner color="primary" variant="grow" className="m-3" />
      </CContainer>
    )
  } else {
    return (
      <CContainer lg>
        <Suspense
          fallback={
            <CContainer className="p-5">
              <CSpinner color="primary" variant="grow" className="m-3" />
              <CSpinner color="primary" variant="grow" className="m-3" />
              <CSpinner color="primary" variant="grow" className="m-3" />
            </CContainer>
          }
        >
          <Routes>
            {routes.map((route, idx) => {
              if (!route.element) return null

              const Element = route.element

              return (
                <Route
                  key={idx}
                  path={route.path}
                  element={
                    route.adminOnly && role !== 'admin' ? (
                      <Navigate to="/403" replace />
                    ) : route.specialAccessOnly && role !== 'advancedUser' && role !== 'admin' ? (
                      <Navigate to="/403" replace />
                    ) : (
                      <Element />
                    )
                    // role === 'admin' ? (
                    //   <Element />
                    // ) : route.advancedUserOnly ? (
                    //   role === 'advancedUser' ? (
                    //     <Element />
                    //   ) : (
                    //     <Navigate to="/403" replace />
                    //   )
                    // ) : (
                    //   <Element />
                    // )
                  }
                />
              )
            })}

            <Route path="/" element={<Navigate to="le-mie-pratiche" replace />} />
          </Routes>
        </Suspense>
      </CContainer>
    )
  }
}

export default React.memo(AppContent)
