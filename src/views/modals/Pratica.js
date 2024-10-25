/* eslint-disable react/prop-types */
import React from 'react'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CCardBody,
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormTextarea,
} from '@coreui/react-pro'

import { FileList, Agenda, PeoplePicker, People } from '@microsoft/mgt-react'

const Pratica = ({ pratica, visible, onClose }) => {
  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={onClose}
      aria-labelledby="StaticBackdropExampleLabel"
      size="xl"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">Prat. No. {pratica.prat_no}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCardBody className="p-3">
          <CRow>
            <CCol className="mb-3">
              <h3>{pratica.title}</h3>
              <span className="fw-bold">Istruzioni superiori: </span>
              {pratica.istruzioni_superiori}
              <CInputGroup className="mb-3 mt-4">
                <CInputGroupText id="basic-addon1">Data iniziale:</CInputGroupText>
                <CFormInput
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText id="basic-addon1">Prat. no.:</CInputGroupText>
                <CFormInput
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText id="basic-addon1">Ente richiedente:</CInputGroupText>
                <CFormInput
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText id="basic-addon1">Persona richiedente:</CInputGroupText>
                <CFormInput
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText id="basic-addon1">Data evento:</CInputGroupText>
                <CFormInput
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText id="basic-addon1">Sezione responsabile:</CInputGroupText>
                <CFormInput
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText id="basic-addon1">
                  Data inoltrato al responsabile della sezione:
                </CInputGroupText>
                <CFormInput
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText id="basic-addon1">Superiori invitati:</CInputGroupText>
                <CFormInput
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
            </CCol>
            <CCol xs={6} className="mt-2">
              {/* <FileList /> */}
              <h6>CORRISPONDENZA</h6>
              <CFormTextarea
                placeholder="Readonly textarea"
                aria-label="Readonly textarea example"
                disabled
                readOnly
              ></CFormTextarea>
            </CCol>
          </CRow>
        </CCardBody>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default Pratica
