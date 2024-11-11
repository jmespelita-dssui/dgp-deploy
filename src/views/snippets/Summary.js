/* eslint-disable react/prop-types */
import React from 'react'

import {
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CCallout,
  CListGroup,
  CListGroupItem,
  CButton,
} from '@coreui/react-pro'
import { cilCheckCircle, cilFolderOpen, cilPencil, cilSpreadsheet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Tasks from './Tasks'

const Summary = ({ item, openPratica }) => {
  const task = item
  return (
    <CContainer>
      <CCallout color="primary" className="mb-5">
        <CCardBody className="p-3">
          <CRow>
            <CCol xs={8} className="me-auto">
              <h3>{task.titolo}</h3>
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
                    <span className="fw-bold">Numero partecipanti/ospiti:</span>
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
                <Tasks />
                <CRow>
                  <CCardBody className="text-body-secondary font-size-sm lh-2">
                    <CRow>Created on {task.data_creazione} </CRow>
                    <CRow>Forwarded to responsabile on {task.data_inoltrata_responsabile}</CRow>
                    <CRow>
                      Last modified by {task.modificato_da} on {task.data_ultima_modifica}
                    </CRow>
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
