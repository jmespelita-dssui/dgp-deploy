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
import Tasks from './Subtasks'
import { Person } from '@microsoft/mgt-react'

const Summary = ({ item, openPratica }) => {
  const task = item
  return (
    <CContainer className="p-3">
      <CCallout color="primary" className="mb-5">
        <CCardBody className="pt-4">
          <CCol xs={8} className="me-auto">
            <h3>{task.cr9b3_titolo}</h3>
          </CCol>

          <span className="fw-bold">Istruzioni superiori: </span>
          {task.cr9b3_istruzionesuperiori}
        </CCardBody>
        <CCardBody className="pb-5">
          <CContainer>
            <CRow className="mb-3">
              {/* Other details */}
              <CCol xs={5} className="me-auto">
                <CListGroup flush>
                  <CListGroupItem>
                    <span className="fw-bold">Ente inviante:</span> {task.cr9b3_enteinviante}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">Materia rapporto:</span> {task.cr9b3_materiarapporto}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">Paese:</span> {task.cr9b3_paese}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">Città: </span> {task.cr9b3_citta}
                  </CListGroupItem>
                  <CListGroupItem>
                    <span className="fw-bold">Diocesi: </span> {task.cr9b3_diocesi}
                  </CListGroupItem>
                </CListGroup>
              </CCol>
              {/* MAIN BODY */}
              <CCol xs={6}>
                {/* task  1*/}
                <Tasks />
                {/* <Person personQuery="j.espelita@dssui.org" showName showEmail showPresence /> */}
              </CCol>
            </CRow>
            <CRow>
              <CCardBody className="text-body-secondary font-size-sm lh-2">
                <CRow>Created on {task.createdon} </CRow>
                <CRow>Forwarded to responsabile on {task.cr9b3_datainoltrataresponsabile}</CRow>
                <CRow>
                  Last modified by {task.modifiedby} on {task.modifiedon}
                </CRow>
              </CCardBody>
            </CRow>
          </CContainer>
        </CCardBody>
      </CCallout>
    </CContainer>
  )
}

export default Summary
