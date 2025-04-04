/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

import {
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CCallout,
  CListGroup,
  CListGroupItem,
} from '@coreui/react-pro'
import Tasks from './Subtasks'
import { emptyTask, getFields } from 'src/util/taskUtils'
import { createAxiosInstance, getAccessToken } from 'src/util/axiosUtils'
import moment from 'moment'

const Summary = ({ pratica }) => {
  const [item, setItem] = useState(pratica)
  const [fields, setFields] = useState({})
  const [createdBy, setCreatedBy] = useState()
  const [modifiedBy, setModifiedBy] = useState()

  useEffect(() => {
    // setFields(getFields(12958))
    if (pratica) {
      setItem(pratica)
    } else {
      setItem(emptyTask)
    }
    getUserDetails()
    setFields(getFields(item.cr9b3_categoria))
  }, [])

  const getUserDetails = async () => {
    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)
    const createdByPromise = await axiosInstance.get(`systemusers(${item._createdby_value})`)
    const modifiedByPromise = await axiosInstance.get(`systemusers(${item._modifiedby_value})`)
    setCreatedBy(createdByPromise.data.fullname)
    setModifiedBy(modifiedByPromise.data.fullname)
  }

  return (
    <CContainer className="p-3">
      <CCardBody className="pt-4">
        <CCol xs={8} className="me-auto">
          <h3>{item.cr9b3_titolo}</h3>
        </CCol>

        <span className="fw-bold">Istruzioni superiori: </span>
        {item.cr9b3_istruzionesuperiori}
      </CCardBody>
      <CCardBody className="pb-5">
        <CContainer>
          <CRow className="mb-3">
            {/* Other details */}
            <CCol xs={5} className="me-auto">
              <CListGroup flush>
                {fields.data_invio_materiale && (
                  <CListGroupItem>
                    <span className="fw-bold">Data invio materiale:</span>{' '}
                    {moment(item.cr9b3_datainviomateriale).format('DD/MM/YYYY')}
                  </CListGroupItem>
                )}
                {fields.data_prima_scadenza && (
                  <CListGroupItem>
                    <span className="fw-bold">Prima scadenza:</span>{' '}
                    {moment(item.dssui_primascadenza).format('DD/MM/YYYY')}
                  </CListGroupItem>
                )}
                {fields.cr9b3_datarichiestacontributo && (
                  <CListGroupItem>
                    <span className="fw-bold">Data richiesta contributo:</span>{' '}
                    {moment(item.cr9b3_datarichiestacontributo).format('DD/MM/YYYY')}
                  </CListGroupItem>
                )}
                {fields.ente_inviante && (
                  <CListGroupItem>
                    <span className="fw-bold">Ente inviante:</span>{' '}
                    {item.cr9b3_datainoltrataresponsabile}
                  </CListGroupItem>
                )}
                {fields.ente_richiedente && (
                  <CListGroupItem>
                    <span className="fw-bold">Ente richiedente:</span> {item.cr9b3_enterichiedente}
                  </CListGroupItem>
                )}
                {fields.ente_ricevente && (
                  <CListGroupItem>
                    <span className="fw-bold">Ente ricevente:</span> {item.cr9b3_entericevente}
                  </CListGroupItem>
                )}
                {fields.persona_richiedente && (
                  <CListGroupItem>
                    <span className="fw-bold">Persona richiedente:</span>{' '}
                    {item.cr9b3_personarichiedente}
                  </CListGroupItem>
                )}
                {/* {fields.dssui_organizzatore && (
                    <CListGroupItem>
                      <span className="fw-bold">DSSUI organizzatore:</span>{' '}
                      {item.cr9b3_dssuiorganizzatore}
                    </CListGroupItem>
                  )} */}
                {fields.destinatari && (
                  <CListGroupItem>
                    <span className="fw-bold">Destinatari:</span> {item.cr9b3_destinatari}
                  </CListGroupItem>
                )}
                {fields.indirizzi_destinatari && (
                  <CListGroupItem>
                    <span className="fw-bold">Indirizzi destinatari:</span>{' '}
                    {item.cr9b3_indirizzidestinatari}
                  </CListGroupItem>
                )}
                {fields.data_evento && (
                  <CListGroupItem>
                    <span className="fw-bold">Data evento:</span>{' '}
                    {moment(item.cr9b3_dataevento).format('DD/MM/YYYY')}
                  </CListGroupItem>
                )}
                {fields.titolo_evento && (
                  <CListGroupItem>
                    <span className="fw-bold">Titolo evento:</span> {item.cr9b3_titoloevento}
                  </CListGroupItem>
                )}
                {fields.luogo_evento && (
                  <CListGroupItem>
                    <span className="fw-bold">Luogo evento:</span> {item.cr9b3_luogoevento}
                  </CListGroupItem>
                )}
                {fields.tema_contributo && (
                  <CListGroupItem>
                    <span className="fw-bold">Tema contributo:</span> {item.cr9b3_temacontributo}
                  </CListGroupItem>
                )}
                {fields.materia_contributo && (
                  <CListGroupItem>
                    <span className="fw-bold">Materia contributo:</span>{' '}
                    {item.cr9b3_materiarapporto}
                  </CListGroupItem>
                )}
                {fields.materia_rapporto && (
                  <CListGroupItem>
                    <span className="fw-bold">Materia rapporto:</span> {item.cr9b3_materiarapporto}
                  </CListGroupItem>
                )}
                {/* {fields.superiori_invitati && (
                    <CListGroupItem>
                    <span className="fw-bold">Superiori invitati:</span>{' '}
                    {item.cr9b3_superioriinvitati}
                    </CListGroupItem>
                    )} */}
                {/* {fields.sezioneresponsabile && (
                    <CListGroupItem>
                    <span className="fw-bold">Superiori invitati:</span>{' '}
                    {item.cr9b3_superioriinvitati}
                    </CListGroupItem>
                    )} */}
                {/* {fields.dssuipartecipanti && (
                    <CListGroupItem>
                    <span className="fw-bold">Superiori invitati:</span>{' '}
                    {item.cr9b3_superioriinvitati}
                    </CListGroupItem>
                    )} */}
                {fields.no_partecipanti && (
                  <CListGroupItem>
                    <span className="fw-bold">No. partecipanti:</span> {item.cr9b3_nopartecipanti}
                  </CListGroupItem>
                )}
                {fields.paese && (
                  <CListGroupItem>
                    <span className="fw-bold">Paese:</span> {item.cr9b3_paese}
                  </CListGroupItem>
                )}
                {fields.regione && (
                  <CListGroupItem>
                    <span className="fw-bold">Regione:</span> {item.cr9b3_regione}
                  </CListGroupItem>
                )}
                {fields.citta && (
                  <CListGroupItem>
                    <span className="fw-bold">Città:</span> {item.cr9b3_citta}
                  </CListGroupItem>
                )}
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
            <CCardBody className="text-body-secondary font-size-sm lh-2 m-4">
              <CRow>
                Created by {createdBy} on {moment(item.createdon).format('DD/MM/YYYY HH:mm')}
              </CRow>
              <CRow>
                Last modified by {modifiedBy} on{' '}
                {moment(item.modifiedon).format('DD/MM/YYYY HH:mm')}
              </CRow>
            </CCardBody>
          </CRow>
        </CContainer>
      </CCardBody>
    </CContainer>
  )
}

export default Summary
