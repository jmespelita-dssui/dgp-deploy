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
import { Person } from '@microsoft/mgt-react'

const Summary = ({ item, openPratica }) => {
  const task = item
  return (
    <CContainer>
      {/* <CCallout color="primary" className="mb-5"> */}
      <CCardBody className="pt-4">
        <CRow>
          <CCol xs={8} className="me-auto">
            <h3>{task.crebd_titolo}</h3>
          </CCol>
          <CCol xs={2} className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton onClick={openPratica}>
              <CIcon icon={cilPencil} size="lg" />
            </CButton>
          </CCol>
        </CRow>

        <span className="fw-bold">Istruzioni superiori: </span>
        {task.crebd_istruzionesuperiori}
      </CCardBody>
      <CCardBody className="pb-5">
        <CContainer>
          <CRow>
            {/* Other details */}
            <CCol xs={5} className="me-auto">
              <CListGroup flush>
                <CListGroupItem>
                  <span className="fw-bold">Ente richiedente:</span> {task.crebd_entericevente}
                </CListGroupItem>
                <CListGroupItem>
                  <span className="fw-bold">DSSUI Organizzatore:</span>{' '}
                  {task.crebd_dssuiorganizzatore}
                </CListGroupItem>
                <CListGroupItem>
                  <span className="fw-bold">Tema contributo:</span> {task.crebd_temacontributo}
                </CListGroupItem>
                <CListGroupItem>
                  <span className="fw-bold">Materia rapporto:</span> {task.crebd_materiarapporto}
                </CListGroupItem>
                <CListGroupItem>
                  <span className="fw-bold">Numero partecipanti/ospiti:</span>
                  {task.crebd_numeropartecipantiospiti}
                </CListGroupItem>
                <CListGroupItem>
                  <span className="fw-bold">Paese:</span> {task.crebd_paese}
                </CListGroupItem>
                <CListGroupItem>
                  <span className="fw-bold">Città: </span> {task.crebd_citta}
                </CListGroupItem>
                <CListGroupItem>
                  <span className="fw-bold">Diocesi: </span> {task.crebd_diocesi}
                </CListGroupItem>
              </CListGroup>
            </CCol>
            {/* MAIN BODY */}
            <CCol xs={6}>
              {/* task  1*/}
              <Tasks />
              {/* <Person personQuery="j.espelita@dssui.org" showName showEmail showPresence /> */}

              <CRow>
                <CCardBody className="text-body-secondary font-size-sm lh-2">
                  <CRow>Created on {task.crebd_datacreazione} </CRow>
                  <CRow>Forwarded to responsabile on {task.crebd_datainoltrataresponsabile}</CRow>
                  <CRow>
                    Last modified by {task.crebd_modificatoda} on {task.crebd_dataultimamodifica}
                  </CRow>
                </CCardBody>
              </CRow>
            </CCol>
          </CRow>
        </CContainer>
      </CCardBody>
      {/* </CCallout> */}
    </CContainer>
  )
}

export default Summary
