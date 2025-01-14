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
  CFormSelect,
  CLink,
} from '@coreui/react-pro'
import { PeoplePicker, Person } from '@microsoft/mgt-react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilX } from '@coreui/icons'
import { useToast } from 'src/context/ToastContext'
import ConfirmClose from '../modals/ConfirmClose'
import { emptyTask } from 'src/util/taskUtils'
import { CountrySelect, CitySelect, StateSelect } from 'react-country-state-city'

const Fields = ({
  pratica,
  superioriInvitati,
  responsabile,
  officialiIncaricati,
  onSaveEdit,
  isView,
  setIsView,
}) => {
  const [fields, setFields] = useState({})
  const [isModified, setIsModified] = useState(false)
  const [praticaEdits, setPraticaEdits] = useState({ cr9b3_praticaid: pratica.cr9b3_praticaid })
  const [formData, setFormData] = useState(emptyTask)
  const [superioriInvitatiList, setSuperioriInvitatiList] = useState([])
  const [responsabileList, setResponsabileList] = useState([])
  const [officilaliIncaricatiList, setOfficialiIncaricatiList] = useState([])
  const [dssuiPratecipantiList, setDssuiPartecipantiList] = useState([])
  const [country, setCountry] = useState({ id: null })
  const [currentState, setCurrentState] = useState({ id: null })
  const [currentCity, setCurrentCity] = useState({ id: null })
  const [isValid, setIsValid] = useState(true)
  const { addToast } = useToast()

  const [visibleConfirmClose, setVisibleConfirmClose] = useState(false)
  const [confirmCloseBody, setConfirmCloseBody] = useState({
    title: 'Confirm',
    text: 'Your changes may not have been saved. Continue?',
  })

  const [render, setRender] = useState(0)

  useEffect(() => {
    setFields(getFields(formData.cr9b3_categoria))
    // setFields(getFields(12958))
    setSuperioriInvitatiList(superioriInvitati)
    setResponsabileList(responsabile)
    setOfficialiIncaricatiList(officialiIncaricati)
    setFormData(changeNullToEmptyString(pratica))
  }, [superioriInvitati, responsabile, officialiIncaricati, render])

  const changeNullToEmptyString = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = value === null ? '' : value // Change null to ""
      return acc
    }, {})
  }

  const forceRerender = () => {
    setPraticaEdits({ cr9b3_praticaid: pratica.cr9b3_praticaid })
    setRender((prev) => prev + 1) // Increment a dummy state to force re-render
  }

  const showConfirmClose = () => {
    setConfirmCloseBody({
      title: 'Confirm',
      text: 'Your changes may not have been saved. Continue?',
    })
    setVisibleConfirmClose(true)
    // setIsView(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    console.log('EDITED PRATICA', praticaEdits)
    // console.log('edit me', officilaliIncaricatiList)
    if (isValid) {
      onSaveEdit(praticaEdits, superioriInvitatiList, responsabileList, officilaliIncaricatiList)
      setIsView(true)
    } else {
      addToast('Please insert valid SharePoint link', 'Create Pratica', 'warning')
    }
  }

  const onCancel = () => {
    setFormData(pratica)
    setVisibleConfirmClose(false)
    setIsView(false)
  }

  const onExit = () => {
    // refreshData()
    forceRerender()
    setIsView(true)
    setVisibleConfirmClose(false)
  }

  // Validate URL using the URL object
  const validateUrl = (value) => {
    try {
      new URL(value) // If valid, no error is thrown
      return value.includes('dssui.sharepoint.com')
    } catch {
      return false
    }
  }

  return (
    <>
      <ConfirmClose
        visible={visibleConfirmClose}
        body={confirmCloseBody}
        onCancel={onCancel}
        onExit={onExit}
      />
      <CForm onSubmit={onSubmit} className="mt-3">
        <CLink href={formData.cr9b3_sharepointlink} target="_blank">
          Open SharePoint folder
        </CLink>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          {!isView && (
            // <CRow className="d-flex justify-content-end">
            <CButton className="mt-3" disabled={!isModified} type="submit">
              Save changes
            </CButton>
            // </CRow>
          )}
          <CButton
            color={isView ? 'primary' : 'light'}
            className="mt-3"
            onClick={() => {
              if (!isView) {
                showConfirmClose()
              } else {
                setIsView(false)
              }
            }}
          >
            <CIcon icon={isView ? cilPencil : cilX} className="me-md-2" />
            {isView ? 'Edit' : 'Cancel'}
          </CButton>
        </div>
        <CContainer className="mt-5">
          <CCol md={6} className="mb-3">
            <CFormSelect
              aria-label="Status"
              value={formData.cr9b3_status}
              options={[
                { label: 'New', value: '10' },
                { label: 'In progress', value: '30' },
                { label: 'Pending response from recipient', value: '50' },
                { label: 'Pending approval from superior', value: '70' },
                { label: 'On hold', value: '40' },
                { label: 'Archive', value: '0' },
                { label: 'Completed', value: '100' },
              ]}
              onChange={(e) => {
                setFormData({ ...formData, cr9b3_status: e.target.value })
                setPraticaEdits({ ...praticaEdits, cr9b3_status: e.target.value })
                setIsModified(true)
              }}
              disabled={isView}
            />
          </CCol>
          <CRow>
            <CCol md={5} className="mb-3">
              <CDatePicker
                label="Data timbro Superiore:"
                date={
                  formData.cr9b3_datatimbrosuperiore &&
                  moment(formData.cr9b3_datatimbrosuperiore).format('YYYY/MM/DD').toString()
                }
                locale="it-IT"
                onDateChange={(e) => {
                  setFormData({ ...formData, cr9b3_datatimbrosuperiore: e })
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
                    formData.dssui_primascadenza &&
                    moment(formData.dssui_primascadenza).format('YYYY/MM/DD').toString()
                  }
                  locale="it-IT"
                  onDateChange={(e) => {
                    setFormData({ ...formData, dssui_primascadenza: e })
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
                    formData.cr9b3_datainviomateriale &&
                    moment(formData.cr9b3_datainviomateriale).format('YYYY/MM/DD').toString()
                  }
                  onDateChange={(e) => {
                    setFormData({ ...formData, cr9b3_datainviomateriale: e })
                    setPraticaEdits({
                      ...praticaEdits,
                      cr9b3_datainviomateriale: e,
                      dssui_primascadenza: e,
                    })
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
                    formData.cr9b3_datarichiestacontributo &&
                    moment(formData.cr9b3_datarichiestacontributo).format('YYYY/MM/DD')
                  }
                  onDateChange={(e) => {
                    setFormData({
                      ...formData,
                      cr9b3_datarichiestacontributo: e,
                      dssui_primascadenza: e,
                    })
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
                  console.log('people picker set responsabile list', responsabileList)
                  setIsModified(true)
                }}
                // visible={isView}
              />
            </>
          )}
          <CCol md={5} className="mt-4">
            <CDatePicker
              date={
                formData.cr9b3_datainoltrataresponsabile &&
                moment(formData.cr9b3_datainoltrataresponsabile).format('YYYY/MM/DD').toString()
              }
              onDateChange={(e) => {
                setFormData({ ...formData, cr9b3_datainoltrataresponsabile: e })
                setPraticaEdits({ ...praticaEdits, cr9b3_datainoltrataresponsabile: e })
                setIsModified(true)
              }}
              locale="it-IT"
              disabled={isView}
              readOnly={isView}
              label="Data inoltrato al responsabile:"
              required={responsabileList.length > 0}
            />
          </CCol>
          <CCol className="mt-4">
            <p>
              Officiale Incaricato
              {officilaliIncaricatiList.length === 0 && isView ? ' (not yet assigned)' : ':'}
            </p>
            {isView ? (
              officilaliIncaricatiList.map((s) => (
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
                  groupId="7430b06a-2d45-4576-b6d9-dd969da4d43b"
                  selectedPeople={officilaliIncaricatiList}
                  selectionChanged={(e) => {
                    setOfficialiIncaricatiList(e.target.selectedPeople)
                    console.log('people picker set officiale list', e.target.selectedPeople)
                    setIsModified(true)
                  }}
                  // visible={isView}
                />
              </>
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
                      // setSuperioriInvitatiList({ ...superioriInvitatiList, e.target.selectedPeople })
                      setSuperioriInvitatiList(e.target.selectedPeople)
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
                value={formData.cr9b3_enteinviante}
                aria-label="Ente inviante"
                aria-describedby="ente-inviante"
                onChange={(e) => {
                  setFormData({ ...formData, cr9b3_enteinviante: e.target.value })
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
                value={formData.cr9b3_enterichiedente}
                aria-label="Ente richiedente"
                aria-describedby="ente-richiedente"
                disabled={isView}
                readOnly={isView}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    cr9b3_enterichiedente: e.target.value,
                  })
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
                value={formData.cr9b3_entericevente}
                aria-label="Ente ricevente"
                aria-describedby="ente-ricevente"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_entericevente: e.target.value })
                  setPraticaEdits({ ...praticaEdits, cr9b3_entericevente: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.persona_richiedente && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="persona-richiedente">Persona richiedente:</CInputGroupText>
              <CFormInput
                value={formData.cr9b3_personarichiedente}
                aria-label="Persona richiedente"
                aria-describedby="persona-richiedente"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_personarichiedente: e.target.value })
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
                value={formData.cr9b3_destinatari}
                aria-label="Destinatari"
                aria-describedby="destinatari"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_destinatari: e.target.value })
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
                value={formData.cr9b3_indirizzidestinatari}
                aria-label="Indirizzi estinatari"
                aria-describedby="indirizzi-destinatari"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_indirizzidestinatari: e.target.value })
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
                  formData.cr9b3_dataevento &&
                  moment(formData.cr9b3_dataevento).format('YYYY/MM/DD HH:mm:ss')
                }
                onDateChange={(e) => {
                  setFormData({ ...formData, cr9b3_dataevento: e })
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
                value={formData.cr9b3_titoloevento}
                aria-label="Titolo evento"
                aria-describedby="titolo-evento"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_titoloevento: e.target.value })
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
                value={formData.cr9b3_luogoevento}
                aria-label="Luogo evento"
                aria-describedby="luogo-evento"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_luogoevento: e.target.value })
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
                value={formData.cr9b3_temacontributo}
                aria-label="Tema del contributo"
                aria-describedby="tema-contributo"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_temacontributo: e.target.value })
                  setPraticaEdits({ ...praticaEdits, cr9b3_temacontributo: e.target.value.trim() })
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
                value={formData.cr9b3_materiarapporto}
                aria-label="Materia del rapporto"
                aria-describedby="materia-rapporto"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_materiarapporto: e.target.value })
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
                value={formData.cr9b3_nopartecipanti}
                aria-label="No. partecipanti"
                aria-describedby="no-partecipanti"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_nopartecipanti: e.target.value })
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
            <>
              <CRow>
                <CCol md={4} className="mb-3">
                  <CountrySelect
                    containerClassName="form-group"
                    inputClassName=""
                    onChange={(_country) => setCountry(_country)}
                    onTextChange={(_txt) => console.log(_txt)}
                    placeHolder="Select Country"
                  />
                </CCol>
              </CRow>
              <CRow>
                {fields.regione && country.id && (
                  <CCol md={4} className="mb-3">
                    <StateSelect
                      countryid={country.id || ''}
                      containerClassName="form-group"
                      inputClassName=""
                      onChange={(_state) => setCurrentState(_state)}
                      onTextChange={(_txt) => console.log(_txt)}
                      placeHolder="Select State"
                    />
                  </CCol>
                )}
              </CRow>
              <CRow>
                {fields.citta && currentState.id && (
                  <CCol md={4} className="mb-5">
                    <CitySelect
                      countryid={country.id || ''}
                      stateid={currentState.id || ''}
                      containerClassName="form-group"
                      inputClassName=""
                      onChange={(_city) => setCurrentCity(_city)}
                      onTextChange={(_txt) => console.log(_txt)}
                      placeHolder="Select City"
                    />
                  </CCol>
                )}
              </CRow>
            </>
          )}

          <CRow className="mb-5">
            <CFormInput
              id="cartella-principale"
              value={formData.cr9b3_sharepointlink}
              label="SharePoint link:"
              aria-label="No. partecipanti"
              aria-describedby="no-partecipanti"
              onChange={(e) => {
                const value = e.target.value
                console.log(isValid)
                setIsValid(validateUrl(value))
                setIsModified(true)
                setFormData({ ...formData, cr9b3_sharepointlink: e.target.value })
                setPraticaEdits({ ...praticaEdits, cr9b3_sharepointlink: e.target.value.trim() })
              }}
              feedbackInvalid="Please insert a valid SharePoint link."
              disabled={isView}
              readOnly={isView}
              invalid={!isValid}
              valid={isValid}
              required
            />
          </CRow>

          <CFormTextarea
            id="notes"
            label="Notes:"
            rows={3}
            text="Ulteriori dettagli"
            value={formData.cr9b3_notes}
            aria-label="Notes"
            aria-describedby="notes"
            onChange={(e) => {
              setIsModified(true)
              setFormData({ ...formData, cr9b3_notes: e.target.value })
              setPraticaEdits({ ...praticaEdits, cr9b3_notes: e.target.value.trim() })
            }}
            disabled={isView}
            readOnly={isView}
          ></CFormTextarea>
        </CContainer>
      </CForm>
    </>
  )
}

export default Fields
