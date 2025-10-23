import React from 'react'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCardImage,
  CCol,
  CContainer,
  CForm,
  CRow,
} from '@coreui/react-pro'

import { Login } from '@microsoft/mgt-react'
import loginImg from 'src/assets/img/login.jpg'

const LoginPage = () => {
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="m-4">
                <CCardBody className="m-4">
                  <CForm>
                    <h1>DSSUI Gestione Pratiche</h1>
                    <CRow>
                      <CCol xs={6}>
                        <Login className="login" />
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
                <CCardImage orientation="top" src={loginImg} />
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default LoginPage
