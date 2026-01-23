import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react-pro'

// routes config
import routes from '../routes'
import { checkAdminAccess, checkSpecialAccess } from 'src/util/accessUtils'

const AppContent = () => {
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [hasSpecialAccess, setHasSpecialAccess] = React.useState(false)

  useEffect(() => {
    checkAdminAccess().then((isAdmin) => {
      setIsAdmin(isAdmin)
    })
    checkSpecialAccess().then((hasAccess) => {
      setHasSpecialAccess(hasAccess)
    })
  }, [])
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
                  route.adminOnly && !isAdmin ? (
                    <Navigate to="/403" replace />
                  ) : route.specialAccessOnly && !hasSpecialAccess ? (
                    <Navigate to="/403" replace />
                  ) : (
                    <Element />
                  )
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

export default React.memo(AppContent)
