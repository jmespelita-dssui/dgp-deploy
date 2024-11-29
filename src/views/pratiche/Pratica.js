/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import ProgettoEsterno from './ProgettoEsterno'

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
  CCard,
  CVirtualScroller,
  CCollapse,
  CNav,
  CNavItem,
  CNavLink,
  CListGroup,
  CListGroupItem,
  CLink,
  CCardHeader,
  CContainer,
  CBadge,
  CForm,
  CFormTextarea,
} from '@coreui/react-pro'

import { FileList, Agenda, PeoplePicker, People } from '@microsoft/mgt-react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import Tasks from './Tasks'

const Pratica = ({ pratica, visible, onClose, labelColor, label }) => {
  const [visibleLinks, setVisibleLinks] = useState(true)
  const [visibleCorr, setVisibleCorr] = useState(false)
  const [visibleLogs, setVisibleLogs] = useState(false)

  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={onClose}
      aria-labelledby="StaticBackdropExampleLabel"
      size="xl"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">
          Prat. No. {pratica.crebd_pratno} / Prot. {pratica.crebd_protno}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CCardBody className="p-3">
          <CRow>
            <CCol className="mb-3 scrollable-container">
              <CBadge color={labelColor} className="mb-2">
                {label}
              </CBadge>
              <h3>{pratica.crebd_titolo}</h3>
              <span className="fw-bold">Istruzioni superiori: </span>
              {pratica.crebd_istruzionesuperiori}
              {/* <CRow className="mt-4">
                <Tasks />
              </CRow> */}
              <ProgettoEsterno pratica={pratica} />
              <CForm>
                <CFormTextarea
                  id="notes"
                  label="Note"
                  rows={3}
                  text="Ulteriori dettagli"
                ></CFormTextarea>
              </CForm>
              <CCardBody className="text-body-secondary font-size-sm lh-2 m-4">
                <CRow>Created on {pratica.createdon} </CRow>
                <CRow>Forwarded to responsabile on {pratica.crebd_datainoltrataresponsabile}</CRow>
                <CRow>
                  Last modified by {pratica.crebd_modificatoda} on {pratica.modifiedon}
                </CRow>
              </CCardBody>
            </CCol>

            {/* CORRESPONDENCE */}

            <CCol xs={6} className="mt-2 overflow-auto">
              <CNav variant="underline" className="mb-3">
                <CNavItem>
                  <CNavLink
                    active={visibleLinks}
                    onClick={() => {
                      setVisibleCorr(false)
                      setVisibleLinks(true)
                      setVisibleLogs(false)
                    }}
                  >
                    Links
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={visibleCorr}
                    onClick={() => {
                      setVisibleCorr(true)
                      setVisibleLinks(false)
                      setVisibleLogs(false)
                    }}
                  >
                    Correspondence
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    active={visibleLogs}
                    onClick={() => {
                      setVisibleCorr(false)
                      setVisibleLinks(false)
                      setVisibleLogs(true)
                    }}
                  >
                    Activity log
                  </CNavLink>
                </CNavItem>
              </CNav>

              <CCollapse visible={visibleCorr}>
                <CButton color="light" className="mb-3">
                  <CIcon
                    icon={cilPlus}
                    className="text-body-secondary icon-link"
                    // onClick={() => {
                    //   toggleDetails(item.prat_no)
                    // }}
                  />
                  Add correspondence
                </CButton>
                <CContainer className="scrollable-container">
                  <CCard className="m-3">
                    <CCardHeader>24/10/2024 by Jena Espelita</CCardHeader>
                    <CCardBody>
                      <p>
                        Subject: Richiesta di incontro con S.E. l’Ambasciatore presso la Santa Sede
                      </p>
                      <p>
                        Gentile Segreteria dell’Ambasciata presso la Santa Sede, mi chiamo Luca
                        Bianchi e rappresento l’organizzazione ItaliCult. Sarei molto onorato di
                        poter organizzare un incontro con S.E. l’Ambasciatore presso la Santa Sede
                        per discutere di alcune iniziative culturali in collaborazione con la vostra
                        ambasciata.
                      </p>
                      <p>
                        Potrei sapere se ci sono disponibilità nei prossimi giorni per un breve
                        incontro? Resto a disposizione per eventuali dettagli e preferenze di orario
                        e luogo da parte di Sua Eccellenza.
                      </p>
                      <p>
                        In attesa di un vostro gentile riscontro, vi ringrazio anticipatamente e
                        porgo i miei più cordiali saluti.
                      </p>
                      <p>Luca Bianchi</p>
                      <p>ItaliCult</p>
                      <p>Tel.: +39 333 1234567</p>
                      <p>Email: luca.bianchi@email.com</p>
                    </CCardBody>
                  </CCard>
                  <CCard className="m-3">
                    <CCardHeader>12/10/2024 by Jena Espelita</CCardHeader>
                    <CCardBody>
                      <p>
                        Oggetto: RE: Richiesta di incontro con S.E. l’Ambasciatore presso la Santa
                        Sede
                      </p>

                      <p>Gentile Sig. Bianchi,</p>

                      <p>
                        La ringraziamo per il suo messaggio e per l’interesse a collaborare con la
                        nostra Ambasciata. S.E. l’Ambasciatore sarebbe lieto di incontrarla e
                        discutere delle iniziative culturali di ItaliCult.
                      </p>

                      <p>
                        Saremmo disponibili per un incontro il 25 novembre alle ore 10:00, presso la
                        nostra sede in via XX Settembre 50. La preghiamo di confermare la sua
                        disponibilità o di suggerire un’altra data e orario qualora non le fosse
                        possibile partecipare in questa data.
                      </p>

                      <p>Restiamo in attesa di una sua cortese risposta.</p>

                      <p>Cordiali saluti,</p>
                      <p>Dott.ssa Maria Rossi</p>
                      <p>Segreteria dell’Ambasciata presso la Santa Sede</p>
                    </CCardBody>
                  </CCard>
                  <CCard className="m-3">
                    <CCardHeader>12/10/2024 by Jena Espelita</CCardHeader>
                    <CCardBody>
                      <p>
                        Oggetto: RE: Richiesta di incontro con S.E. l’Ambasciatore presso la Santa
                        Sede
                      </p>

                      <p>Gentile Sig. Bianchi,</p>

                      <p>
                        La ringraziamo per il suo messaggio e per l’interesse a collaborare con la
                        nostra Ambasciata. S.E. l’Ambasciatore sarebbe lieto di incontrarla e
                        discutere delle iniziative culturali di ItaliCult.
                      </p>

                      <p>
                        Saremmo disponibili per un incontro il 25 novembre alle ore 10:00, presso la
                        nostra sede in via XX Settembre 50. La preghiamo di confermare la sua
                        disponibilità o di suggerire un’altra data e orario qualora non le fosse
                        possibile partecipare in questa data.
                      </p>

                      <p>Restiamo in attesa di una sua cortese risposta.</p>

                      <p>Cordiali saluti,</p>
                      <p>Dott.ssa Maria Rossi</p>
                      <p>Segreteria dell’Ambasciata presso la Santa Sede</p>
                    </CCardBody>
                  </CCard>
                  <CCard className="m-3">
                    <CCardHeader>12/10/2024 by Jena Espelita</CCardHeader>
                    <CCardBody>
                      <p>
                        Oggetto: RE: Richiesta di incontro con S.E. l’Ambasciatore presso la Santa
                        Sede
                      </p>

                      <p>Gentile Sig. Bianchi,</p>

                      <p>
                        La ringraziamo per il suo messaggio e per l’interesse a collaborare con la
                        nostra Ambasciata. S.E. l’Ambasciatore sarebbe lieto di incontrarla e
                        discutere delle iniziative culturali di ItaliCult.
                      </p>

                      <p>
                        Saremmo disponibili per un incontro il 25 novembre alle ore 10:00, presso la
                        nostra sede in via XX Settembre 50. La preghiamo di confermare la sua
                        disponibilità o di suggerire un’altra data e orario qualora non le fosse
                        possibile partecipare in questa data.
                      </p>

                      <p>Restiamo in attesa di una sua cortese risposta.</p>

                      <p>Cordiali saluti,</p>
                      <p>Dott.ssa Maria Rossi</p>
                      <p>Segreteria dell’Ambasciata presso la Santa Sede</p>
                    </CCardBody>
                  </CCard>
                </CContainer>
              </CCollapse>
              <CCollapse visible={visibleLinks}>
                <CCard className="mb-3">
                  <CCardBody>
                    <h6>RELATED PRATICA</h6>
                    <CListGroup flush>
                      <CListGroupItem>
                        <CLink>572814 - Progetto Giovani per la Pace </CLink>
                      </CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
                <CCard className="mb-3">
                  <CCardBody>
                    <h6>REQUEST</h6>
                    <CListGroup flush>
                      <CListGroupItem>
                        <CLink>Share QSN Convention_report-compressé.pdf</CLink>
                      </CListGroupItem>
                      <CListGroupItem>
                        <CLink>2023 Booklet - Resettlement & Community Sponsorhip.pdf</CLink>
                      </CListGroupItem>
                      <CListGroupItem>
                        <CLink>
                          Evaluating Community Sponsorship Across Europe — Share Network
                          (share-network.eu)
                        </CLink>
                      </CListGroupItem>
                    </CListGroup>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <CButton color="light" className="mt-3">
                        <CIcon icon={cilPlus} className="me-md-2" />
                        Add link
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
                <CCard className="mb-3">
                  <CCardBody>
                    <h6>FOLLOW UP</h6>
                    <CListGroup flush>
                      <CListGroupItem>
                        <CLink>Porta ac consectetur ac</CLink>
                      </CListGroupItem>
                      <CListGroupItem>
                        <CLink>Vestibulum at eros</CLink>
                      </CListGroupItem>
                    </CListGroup>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <CButton color="light" className="mt-3">
                        <CIcon icon={cilPlus} className="me-md-2" />
                        Add link
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCollapse>
              <CCollapse visible={visibleLogs}>
                <CCard className="mb-3">
                  <CCardBody className="scrollable-container">
                    <CListGroup flush>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:00 AM: </strong>Task created by Sarah Lee -
                        &quot;Design and implement a new website layout.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:10 AM:</strong> Assigned to Design Team by Sarah
                        Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 15, 2024, 11:30 AM: </strong>Status changed to &quot;In
                        Progress&quot; by John Smith - Wireframes in progress
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 20, 2024, 02:45 PM: </strong>Comment added by Sarah Lee -&quot;
                        Focus on mobile responsiveness.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 25, 2024, 03:00 PM:</strong> File uploaded by John Smith -&quot;
                        Homepage_Wireframe_v1.pdf.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 28, 2024, 04:00 PM:</strong> Priority changed to
                        &quot;Medium&quot; by Sarah Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 5, 2024, 10:00 AM:</strong>Status changed to &quot;Review&quot;
                        by John Smith - Ready for feedback
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 10, 2024, 05:30 PM: </strong>Status changed to
                        &quot;Completed&quot; by Sarah Lee - Project approved.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:00 AM: </strong>Task created by Sarah Lee -
                        &quot;Design and implement a new website layout.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:10 AM:</strong> Assigned to Design Team by Sarah
                        Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 15, 2024, 11:30 AM: </strong>Status changed to &quot;In
                        Progress&quot; by John Smith - Wireframes in progress
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 20, 2024, 02:45 PM: </strong>Comment added by Sarah Lee -&quot;
                        Focus on mobile responsiveness.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 25, 2024, 03:00 PM:</strong> File uploaded by John Smith -&quot;
                        Homepage_Wireframe_v1.pdf.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 28, 2024, 04:00 PM:</strong> Priority changed to
                        &quot;Medium&quot; by Sarah Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 5, 2024, 10:00 AM:</strong>Status changed to &quot;Review&quot;
                        by John Smith - Ready for feedback
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 10, 2024, 05:30 PM: </strong>Status changed to
                        &quot;Completed&quot; by Sarah Lee - Project approved.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:00 AM: </strong>Task created by Sarah Lee -
                        &quot;Design and implement a new website layout.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:10 AM:</strong> Assigned to Design Team by Sarah
                        Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 15, 2024, 11:30 AM: </strong>Status changed to &quot;In
                        Progress&quot; by John Smith - Wireframes in progress
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 20, 2024, 02:45 PM: </strong>Comment added by Sarah Lee -&quot;
                        Focus on mobile responsiveness.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 25, 2024, 03:00 PM:</strong> File uploaded by John Smith -&quot;
                        Homepage_Wireframe_v1.pdf.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 28, 2024, 04:00 PM:</strong> Priority changed to
                        &quot;Medium&quot; by Sarah Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 5, 2024, 10:00 AM:</strong>Status changed to &quot;Review&quot;
                        by John Smith - Ready for feedback
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 10, 2024, 05:30 PM: </strong>Status changed to
                        &quot;Completed&quot; by Sarah Lee - Project approved.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:00 AM: </strong>Task created by Sarah Lee -
                        &quot;Design and implement a new website layout.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:10 AM:</strong> Assigned to Design Team by Sarah
                        Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 15, 2024, 11:30 AM: </strong>Status changed to &quot;In
                        Progress&quot; by John Smith - Wireframes in progress
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 20, 2024, 02:45 PM: </strong>Comment added by Sarah Lee -&quot;
                        Focus on mobile responsiveness.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 25, 2024, 03:00 PM:</strong> File uploaded by John Smith -&quot;
                        Homepage_Wireframe_v1.pdf.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 28, 2024, 04:00 PM:</strong> Priority changed to
                        &quot;Medium&quot; by Sarah Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 5, 2024, 10:00 AM:</strong>Status changed to &quot;Review&quot;
                        by John Smith - Ready for feedback
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 10, 2024, 05:30 PM: </strong>Status changed to
                        &quot;Completed&quot; by Sarah Lee - Project approved.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:00 AM: </strong>Task created by Sarah Lee -
                        &quot;Design and implement a new website layout.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 10, 2024, 09:10 AM:</strong> Assigned to Design Team by Sarah
                        Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 15, 2024, 11:30 AM: </strong>Status changed to &quot;In
                        Progress&quot; by John Smith - Wireframes in progress
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 20, 2024, 02:45 PM: </strong>Comment added by Sarah Lee -&quot;
                        Focus on mobile responsiveness.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 25, 2024, 03:00 PM:</strong> File uploaded by John Smith -&quot;
                        Homepage_Wireframe_v1.pdf.&quot;
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Oct 28, 2024, 04:00 PM:</strong> Priority changed to
                        &quot;Medium&quot; by Sarah Lee.
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 5, 2024, 10:00 AM:</strong>Status changed to &quot;Review&quot;
                        by John Smith - Ready for feedback
                      </CListGroupItem>
                      <CListGroupItem>
                        <strong>Nov 10, 2024, 05:30 PM: </strong>Status changed to
                        &quot;Completed&quot; by Sarah Lee - Project approved.
                      </CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCollapse>
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
