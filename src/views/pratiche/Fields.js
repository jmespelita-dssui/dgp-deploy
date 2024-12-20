/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { getFields } from 'src/util/taskUtils'

import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CContainer,
  CDatePicker,
  CCol,
  CRow,
  CCardBody,
  CButton,
  CForm,
  CFormTextarea,
  CLoadingButton,
} from '@coreui/react-pro'
import { PeoplePicker, Person } from '@microsoft/mgt-react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilX } from '@coreui/icons'

const Fields = ({ pratica, superioriInvitati, responsabile, onSaveEdit, loading }) => {
  const [isView, setIsView] = useState(true)
  const [fields, setFields] = useState({})
  const [isModified, setIsModified] = useState(false)
  const [praticaEdits, setPraticaEdits] = useState({ cr9b3_praticaid: pratica.cr9b3_praticaid })
  const [initialPratica, setInitialPratica] = useState({})
  const [superioriInvitatiList, setSuperioriInvitatiList] = useState([])
  const [responsabileList, setResponsabileList] = useState([])
  const [officialeList, setOfficialeList] = useState([])
  const [dssuiPratecipantiList, setDssuiPartecipantiList] = useState([])

  useEffect(() => {
    // setFields(getFields(initialPratica.cr9b3_categoria))
    setInitialPratica(pratica)
    setFields(getFields(12958))
    setSuperioriInvitatiList(superioriInvitati)
    setResponsabileList(responsabile)
    // setPraticaEdits(pratica)
  }, [superioriInvitati, responsabile])

  const onCancel = () => {
    setIsView(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    console.log('EDITED PRATICA', praticaEdits)
    onSaveEdit(praticaEdits)
    setIsView(true)
  }

  return (
    <>
      <CForm onSubmit={onSubmit}>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          {!isView && (
            // <CRow className="d-flex justify-content-end">
            <CLoadingButton
              className="mt-3"
              disabled={!isModified}
              type="submit"
              spinnerType="grow"
              disabledOnLoading
              loading={loading}
            >
              Save changes
            </CLoadingButton>
            // </CRow>
          )}
          <CButton
            color={isView ? 'primary' : 'light'}
            className="mt-3"
            onClick={() => {
              setIsView(!isView)
              if (!isView) {
                onCancel()
                console.log('reset form!')
              }
            }}
          >
            <CIcon icon={isView ? cilPencil : cilX} className="me-md-2" />
            {isView ? 'Edit' : 'Cancel'}
          </CButton>
        </div>
        <CContainer className="mt-5">
          <CRow>
            <CCol md={5} className="mb-3">
              <CDatePicker
                label="Data timbro Superiore:"
                date={
                  initialPratica.cr9b3_datatimbrosuperiore &&
                  moment(initialPratica.cr9b3_datatimbrosuperiore).format('YYYY/MM/DD').toString()
                }
                locale="it-IT"
                onDateChange={(e) => {
                  console.log(e)
                  setPraticaEdits({ ...praticaEdits, cr9b3_datatimbrosuperiore: e })
                  setIsModified(true)
                }}
                readOnly={isView}
                disabled={isView}
              />
            </CCol>
            {fields.data_prima_scadenza && (
              <CCol md={5} className="mb-3">
                <CDatePicker
                  label="Data prima scadenza:"
                  date={
                    initialPratica.dssui_primascadenza &&
                    moment(initialPratica.dssui_primascadenza).format('YYYY/MM/DD').toString()
                  }
                  locale="it-IT"
                  onDateChange={(e) => {
                    console.log(e)
                    setPraticaEdits({ ...praticaEdits, dssui_primascadenza: e })
                    setIsModified(true)
                  }}
                  disabled={isView}
                  readOnly={isView}
                />
              </CCol>
            )}
            {fields.data_invio_materiale && (
              <CCol md={5} className="mb-3">
                <CDatePicker
                  label="Scadenza invio del materiale:"
                  date={
                    initialPratica.cr9b3_datainviomateriale &&
                    moment(initialPratica.cr9b3_datainviomateriale).format('YYYY/MM/DD').toString()
                  }
                  onDateChange={(e) => {
                    console.log(e)
                    setPraticaEdits({ ...praticaEdits, cr9b3_datainviomateriale: e })
                    setIsModified(true)
                  }}
                  disabled={isView}
                  readOnly={isView}
                />
              </CCol>
            )}
            {fields.data_richiesta_contributo && (
              <CCol md={5} className="mb-3">
                <CDatePicker
                  label="Scadenza richiesta contributo:"
                  date={
                    initialPratica.cr9b3_datarichiestacontributo &&
                    moment(initialPratica.cr9b3_datarichiestacontributo).format('YYYY/MM/DD')
                  }
                  onDateChange={(e) => {
                    console.log(e)
                    setPraticaEdits({
                      ...praticaEdits,
                      cr9b3_datarichiestacontributo: e,
                    })
                    setIsModified(true)
                  }}
                  disabled={isView}
                  readOnly={isView}
                />
              </CCol>
            )}
          </CRow>
        </CContainer>
        <CContainer className="mb-5 mt-3">
          <p>
            Responsabile Sezione
            {responsabileList.length === 0 && isView ? ' (not yet assigned)' : ':'}
          </p>
          {isView ? (
            responsabileList.map((s) => (
              <Person
                key={s.id}
                className="m-3"
                personQuery={s.mail}
                personCardInteraction="hover"
                showPresence={false} // Optional: show presence status
                view="twoLines"
              />
            ))
          ) : (
            <>
              <PeoplePicker
                className="mt-2"
                groupId="2e227ba3-c594-4117-b106-d9735ddf4d26"
                selectedPeople={responsabileList}
                selectionChanged={(e) => {
                  setResponsabileList(e.target.selectedPeople)
                  setPraticaEdits({
                    ...praticaEdits,
                    cr9b3_datarichiestacontributo: e.target.selectedPeople,
                  })
                  setIsModified(true)
                }}
                // visible={isView}
              />
            </>
          )}
          <CCol md={5} className="mt-4">
            <CDatePicker
              date={
                initialPratica.cr9b3_datainoltrataresponsabile &&
                moment(initialPratica.cr9b3_datainoltrataresponsabile)
                  .format('YYYY/MM/DD')
                  .toString()
              }
              onDateChange={(e) => {
                console.log(e)
                setPraticaEdits({ ...praticaEdits, cr9b3_datainoltrataresponsabile: e })
                setIsModified(true)
              }}
              locale="it-IT"
              disabled={isView}
              readOnly={isView}
              label="Data inoltrato al responsabile:"
            />
          </CCol>
          <p className="mt-5">
            Officiale incaricato
            {officialeList.length === 0 && isView ? ' (not yet assigned)' : ':'}
          </p>

          <CCol className="mb-3">
            {isView ? (
              officialeList.map((s) => (
                <Person
                  key={s.id}
                  className="m-3"
                  personQuery={s.mail}
                  personCardInteraction="hover"
                  showPresence={false} // Optional: show presence status
                  view="twoLines"
                />
              ))
            ) : (
              <PeoplePicker
                className="mt-2"
                groupId="7430b06a-2d45-4576-b6d9-dd969da4d43b"
                selectedPeople={officialeList}
                selectionChanged={(e) => {
                  setOfficialeList(e.target.selectedPeople)
                  setIsModified(true)
                }}
              />
            )}
          </CCol>
          {fields.superiori_invitati && (
            <>
              <p className="mt-5">
                Superiori invitati{' '}
                {superioriInvitatiList.length === 0 && isView ? '(not yet assigned)' : ':'}
              </p>
              <CCol className="mb-5">
                {isView ? (
                  superioriInvitatiList.map((s) => (
                    <Person
                      key={s.id}
                      className="m-3"
                      personQuery={s.mail}
                      personCardInteraction="hover"
                      showPresence={false} // Optional: show presence status
                      view="twoLines"
                    />
                  ))
                ) : (
                  <PeoplePicker
                    className="mt-2"
                    groupId="317aa3d0-a94a-4c7c-bcb9-8870cfececa4"
                    selectedPeople={superioriInvitatiList}
                    selectionChanged={(e) => {
                      setSuperioriInvitatiList({ ...superioriInvitatiList })
                      setIsModified(true)
                    }}
                  />
                )}
              </CCol>
            </>
          )}

          {fields.dssui_partecipanti && (
            <>
              <p className="mt-5">
                Partecipanti DSSUI{' '}
                {dssuiPratecipantiList.length === 0 && isView ? '(not yet assigned)' : ':'}
              </p>
              <CCol className="mb-5">
                {isView ? (
                  dssuiPratecipantiList.map((s) => (
                    <Person
                      key={s.id}
                      className="m-3"
                      personQuery={s.mail}
                      personCardInteraction="hover"
                      showPresence={false} // Optional: show presence status
                      view="twoLines"
                    />
                  ))
                ) : (
                  <PeoplePicker
                    className="mt-2"
                    groupId="7430b06a-2d45-4576-b6d9-dd969da4d43b"
                    selectedPeople={dssuiPratecipantiList}
                    selectionChanged={(e) => {
                      setDssuiPartecipantiList(e.target.selectedPeople)
                      setIsModified(true)
                    }}
                  />
                )}
              </CCol>
            </>
          )}
        </CContainer>
        <CContainer className="mb-5">
          {fields.ente_inviante && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="ente-inviante">Ente inviante:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_enteinviante}
                aria-label="Ente inviante"
                aria-describedby="ente-inviante"
                onChange={(e) => {
                  console.log(e.target.value.trim())
                  setPraticaEdits({ ...praticaEdits, cr9b3_enteinviante: e.target.value.trim() })
                  setIsModified(true)
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.ente_richiedente && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="ente-richiedente">Ente richiedente:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_enterichiedente}
                aria-label="Ente richiedente"
                aria-describedby="ente-richiedente"
                disabled={isView}
                readOnly={isView}
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({ ...praticaEdits, cr9b3_enterichiedente: e.target.value.trim() })
                }}
              />
            </CInputGroup>
          )}
          {fields.ente_ricevente && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="ente-ricevente">Ente ricevente:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_entericevente}
                aria-label="Ente ricevente"
                aria-describedby="ente-ricevente"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({ ...praticaEdits, cr9b3_entericevente: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.persona_richiedente && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="ente-richiedente">Persona richiedente:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_personarichiedente}
                aria-label="Persona richiedente"
                aria-describedby="persona-richiedente"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({
                    ...praticaEdits,
                    cr9b3_personarichiedente: e.target.value.trim(),
                  })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.destinatari && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="destinatari">Destinatari:</CInputGroupText>
              <CFormTextarea
                defaultValue={initialPratica.cr9b3_destinatari}
                aria-label="Destinatari"
                aria-describedby="destinatari"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({ ...praticaEdits, cr9b3_destinatari: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.indirizzi_destinatari && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="indirizzi-destinatari">Indirizzi destinatari:</CInputGroupText>
              <CFormTextarea
                defaultValue={initialPratica.cr9b3_indirizzidestinatari}
                aria-label="Indirizzi estinatari"
                aria-describedby="indirizzi-destinatari"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({
                    ...praticaEdits,
                    cr9b3_indirizzidestinatari: e.target.value.trim(),
                  })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
        </CContainer>
        <CContainer className="mb-5">
          {fields.data_evento && (
            <CCol md={6} className="mb-3">
              <CDatePicker
                date={
                  initialPratica.cr9b3_dataevento &&
                  moment(initialPratica.cr9b3_dataevento).format('YYYY/MM/DD HH:mm:ss')
                }
                onDateChange={(e) => {
                  console.log(e)
                  setPraticaEdits({ ...praticaEdits, cr9b3_dataevento: e })
                  setIsModified(true)
                }}
                label="Data evento:"
                timepicker
                disabled={isView}
                readOnly={isView}
              />
            </CCol>
          )}
          {fields.titolo_evento && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="titolo-evento">Titolo evento:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_titoloevento}
                aria-label="Titolo evento"
                aria-describedby="titolo-evento"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({ ...praticaEdits, cr9b3_titoloevento: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.luogo_evento && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="luogo-evento">Luogo evento:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_luogoevento}
                aria-label="Luogo evento"
                aria-describedby="luogo-evento"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({ ...praticaEdits, cr9b3_luogoevento: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.tema_contributo && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="tema-contributo">Tema del contributo:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_temacontributo}
                aria-label="Tema del contributo"
                aria-describedby="tema-contributo"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({ ...praticaEdits, cr9b3_temacontributo: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.materia_contributo && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="materia-contributo">Materia del contributo:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_materiacontributo}
                aria-label="Materia del contributo"
                aria-describedby="materia-contributo"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({
                    ...praticaEdits,
                    cr9b3_materiacontributo: e.target.value.trim(),
                  })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.materia_rapporto && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="materia-contributo">Materia del rapporto:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_materiarapporto}
                aria-label="Materia del rapporto"
                aria-describedby="materia-rapporto"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({
                    ...praticaEdits,
                    cr9b3_materiarapporto: e.target.value.trim(),
                  })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.no_partecipanti && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="no-partecipanti">No. partecipanti:</CInputGroupText>
              <CFormInput
                type="number"
                defaultValue={initialPratica.cr9b3_nopartecipanti}
                aria-label="No. partecipanti"
                aria-describedby="no-partecipanti"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({ ...praticaEdits, cr9b3_nopartecipanti: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
        </CContainer>

        <CContainer className="mb-5">
          {fields.paese && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="paese">Paese:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_paese}
                aria-label="Paese"
                aria-describedby="paese"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({ ...praticaEdits, cr9b3_paese: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.regione && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="regione">Regione:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_regione}
                aria-label="Regione"
                aria-describedby="regione"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({ ...praticaEdits, cr9b3_regione: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.citta && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="citta">Città:</CInputGroupText>
              <CFormInput
                defaultValue={initialPratica.cr9b3_citta}
                aria-label="Città"
                aria-describedby="citta"
                onChange={(e) => {
                  setIsModified(true)
                  setPraticaEdits({ ...praticaEdits, cr9b3_citta: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          <CFormTextarea id="notes" label="Note" rows={3} text="Ulteriori dettagli"></CFormTextarea>
        </CContainer>
      </CForm>
    </>
  )
}

export default Fields
