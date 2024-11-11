import React from 'react'
import { CCardBody, CAvatar, CRow, CCol, CFormCheck } from '@coreui/react-pro'

const Tasks = () => {
  return (
    <>
      <h6>TASKS</h6>
      <CCardBody className="p-3">
        <CCol xs={12}>
          <CRow>
            <CCol xs={8}>
              <CFormCheck
                label="Send to richiedente before sundown, while the birds fly on high."
                // disabled
              />
            </CCol>
            <CCol xs={2}>
              <CAvatar color="primary" size="sm" textColor="white">
                JM
              </CAvatar>
              <CAvatar color="secondary" size="sm">
                AM
              </CAvatar>
            </CCol>
          </CRow>
        </CCol>
        {/* task  2*/}
        <CCol xs={12}>
          <CRow>
            <CCol xs={8}>
              <CFormCheck label="Draft letter to recipient" checked />
            </CCol>
            <CCol xs={2}>
              <CAvatar color="warning" size="sm" textColor="white">
                AA
              </CAvatar>
            </CCol>
          </CRow>
        </CCol>
      </CCardBody>
    </>
  )
}

export default Tasks
