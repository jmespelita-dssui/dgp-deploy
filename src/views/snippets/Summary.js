/* eslint-disable react/prop-types */
import React from 'react'

import {
  CCardBody,
  CCollapse,
  CAvatar,
  CContainer,
  CRow,
  CCol,
  CCallout,
  CFormCheck,
  CFormLabel,
  CFormInput,
  CListGroup,
  CListGroupItem,
  CButton,
} from '@coreui/react-pro'
import { cilCheckCircle, cilFolderOpen, cilPencil, cilSpreadsheet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Summary = ({ item, openPratica }) => {
  const task = item
  return (
    <CContainer>
      <CCallout color="primary">
        <CCardBody className="p-3">
          <CRow>
            <CCol xs={8} className="me-auto">
              <h3>{task.title}</h3>
            </CCol>
            <CCol xs={2} className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton onClick={openPratica}>
                <CIcon icon={cilPencil} size="lg" />
              </CButton>
            </CCol>
          </CRow>

          <span className="fw-bold">Istruzioni superiori: </span>
          {task.istruzioni_superiori}
        </CCardBody>
        <CCardBody className="p-3">
          <CContainer>
            <CRow>
              {/* Other details */}
              <CCol xs={5} className="me-auto">
                <CListGroup flush>
                  <CListGroupItem>
                    <span className="fw-bold">Ente richiedente:</span> {task.ente_richiedente}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">DSSUI Organizzatore:</span> {task.dssui_organizzatore}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">Tema contributo:</span> {task.tema_contributo}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">Materia rapporto:</span> {task.materia_rapporto}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">Numero partecipanti/ospiti:</span>{' '}
                    {task.numero_partecipanti_ospiti}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">Paese:</span> {task.paese}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">Città: </span> {task.città}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">Diocesi: </span> {task.diocesi}
                  </CListGroupItem>
                </CListGroup>
              </CCol>
              {/* MAIN BODY */}
              <CCol xs={6}>
                {/* task  1*/}
                <h6>TASKS</h6>
                <CCardBody className="p-3">
                  <CCol xs={12}>
                    <CRow>
                      <CCol xs={8}>
                        <CFormCheck
                          label="Send to richiedente before sundown, while the birds fly on high."
                          disabled
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
                        <CFormCheck label="Draft letter to recipient" checked disabled />
                      </CCol>
                      <CCol xs={2}>
                        <CAvatar color="warning" size="sm" textColor="white">
                          AA
                        </CAvatar>
                      </CCol>
                    </CRow>
                  </CCol>
                </CCardBody>
                <CRow>
                  <CCardBody className="text-body-secondary font-size-sm lh-2">
                    <CRow>Created on 3/10/2024 </CRow>
                    <CRow>Forwarded to responsabile on 15/10/2024</CRow>
                    <CRow>Last modified by Jena Espelita on 22/10/2024</CRow>
                  </CCardBody>
                </CRow>
              </CCol>
            </CRow>
          </CContainer>
        </CCardBody>
      </CCallout>
    </CContainer>
  )
}

export default Summary
