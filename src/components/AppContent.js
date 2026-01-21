import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react-pro'

// routes config
import routes from '../routes'

const AppContent = () => {
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
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="le-mie-pratiche" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
