import React from 'react'
import { CCol, CContainer, CRow } from '@coreui/react-pro'

const Page403 = () => {
  return (
    <CContainer>
      <CRow className="justify-content-center mt-5">
        <CCol md={6}>
          <div className="clearfix">
            <h1 className="float-start display-3 me-4">403</h1>
            <h4 className="pt-3">Oups!</h4>
            <p className="text-medium-emphasis float-start">Non hai accesso a questa pagina.</p>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Page403
