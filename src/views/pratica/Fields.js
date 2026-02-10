/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { getFields } from 'src/util/taskUtils'
import { GetCountries } from 'react-country-state-city'
import { getPratica } from 'src/util/taskUtils'

import {
  CBadge,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CContainer,
  CDatePicker,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormTextarea,
  CFormSelect,
  CTooltip,
} from '@coreui/react-pro'
import { PeoplePicker, Person } from '@microsoft/mgt-react'
import CIcon from '@coreui/icons-react'
import { cilInbox, cilPencil, cilTrash, cilX } from '@coreui/icons'
import { useToast } from 'src/context/ToastContext'
import ConfirmClose from '../modals/ConfirmClose'
import { emptyTask } from 'src/util/taskUtils'
import { CountrySelect } from 'react-country-state-city'
import 'react-country-state-city/dist/react-country-state-city.css'
import ChooseCategory from '../createPratica/ChooseCategory'
import ProtNos from '../createPratica/ProtNos'
import { initializeAxiosInstance } from 'src/util/axiosUtils'

const Fields = ({
  pratica,
  superioriInvitati,
  responsabile,
  officialiIncaricati,
  onSaveEdit,
  isView,
  setIsView,
  onDeletePratica,
  // labelColor,
  // label,
  // categoryLabel,
}) => {
  const [fields, setFields] = useState({})
  const [isModified, setIsModified] = useState(false)
  const [praticaEdits, setPraticaEdits] = useState({ cr9b3_praticaid: pratica.cr9b3_praticaid })
  const [formData, setFormData] = useState(emptyTask)
  const [superioriInvitatiList, setSuperioriInvitatiList] = useState([])
  const [responsabileList, setResponsabileList] = useState([])
  const [officilaliIncaricatiList, setOfficialiIncaricatiList] = useState([])
  const [label, setLabel] = useState()
  const [labelColor, setLabelColor] = useState()
  const [protNoArray, setProtNoArray] = useState([])

  const [isValid, setIsValid] = useState(true)
  const { addToast } = useToast()
  const [confirmAction, setConfirmAction] = useState('')

  const [visibleConfirmClose, setVisibleConfirmClose] = useState(false)
  const [visibleChooseCategory, setVisibleChooseCategory] = useState(false)
  const [confirmCloseBody, setConfirmCloseBody] = useState({
    title: 'Conferma azione',
    text: 'Le tue modifiche potrebbero non essere salvate. Continuare?',
  })
  const [country, setCountry] = useState({ id: null })

  useEffect(() => {
    // console.log('starting data', pratica)
    setFields(getFields(formData.cr9b3_categoria))
    setLabel(getFields(formData.cr9b3_categoria))
    // setFields(getFields(12958))
    setSuperioriInvitatiList(superioriInvitati)
    setResponsabileList(responsabile)
    setOfficialiIncaricatiList(officialiIncaricati)
    setFormData(pratica)
    setIsModified(false)
    GetCountries().then((result) => {
      setCountry(result.find((country) => country.id === Number(formData.cr9b3_paese)))
    })
  }, [superioriInvitati, responsabile, officialiIncaricati])

  const changeNullToEmptyString = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = value === null ? '' : value // Change null to ""
      return acc
    }, {})
  }

  const triggerUpdateProtNos = (e) => {
    let protNoArr = e && e.length > 0 ? e : ''
    let stringifiedArr = Array.isArray(protNoArr) ? JSON.stringify(protNoArr) : protNoArr
    setFormData({ ...formData, cr9b3_protno2: stringifiedArr })
    setProtNoArray(stringifiedArr)
    setIsModified(true)
  }

  const showConfirmClose = () => {
    setVisibleConfirmClose(true)
  }

  const saveCategory = (cat) => {
    setLabel(getFields(Number(cat)))
    setFields(getFields(Number(cat)))
    setVisibleChooseCategory(false)
    setFormData({ ...formData, cr9b3_categoria: cat })
    setPraticaEdits({ ...praticaEdits, cr9b3_categoria: cat })
    setIsModified(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    // console.log(pratica, praticaEdits)

    if (isValid) {
      onSaveEdit(
        { ...praticaEdits, cr9b3_protno2: protNoArray.length ? protNoArray : null },
        superioriInvitatiList,
        responsabileList,
        officilaliIncaricatiList,
        '',
      )
      // setIsView(true)
    } else {
      addToast('Inserire un link valido.', 'Creare Pratica', 'warning')
    }
  }

  const onCancel = () => {
    setVisibleConfirmClose(false)
    setIsView(true)
  }

  const onExit = async () => {
    if (confirmAction === 'close') {
      let refreshPratica = await getPratica(formData.cr9b3_praticaid)
      setFormData(refreshPratica)
      setPraticaEdits({ cr9b3_praticaid: pratica.cr9b3_praticaid })
    } else if (confirmAction === 'archive') {
      setFormData({ ...formData, cr9b3_status: 0 })
      onSaveEdit(
        { ...praticaEdits, cr9b3_status: 0 },
        superioriInvitatiList,
        responsabileList,
        officilaliIncaricatiList,
        'archive',
      )
    } else if (confirmAction === 'delete') {
      onDeletePratica()
    } else {
      setFormData({ ...formData, cr9b3_status: 10 })
      onSaveEdit(
        { ...praticaEdits, cr9b3_status: 10 },
        superioriInvitatiList,
        responsabileList,
        officilaliIncaricatiList,
        'unarchive',
      )
    }
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
      <ChooseCategory
        cat={formData.cr9b3_categoria}
        visible={visibleChooseCategory}
        onCancel={() => setVisibleChooseCategory(false)}
        onSave={saveCategory}
      />
      <ConfirmClose
        visible={visibleConfirmClose}
        body={confirmCloseBody}
        onCancel={onCancel}
        onContinue={onExit}
      />
      <CForm onSubmit={onSubmit} className="mt-3">
        {isView && label ? (
          <>
            <CBadge color={label.color} className="mb-2">
              {label.label}
            </CBadge>
            <h3 className="mt-3">{formData.cr9b3_titolo}</h3>
            <CRow className="m-3">
              <p>
                <strong>Istruzioni superiori:</strong> {formData.cr9b3_istruzionesuperiori}
              </p>
            </CRow>
          </>
        ) : (
          <>
            <CTooltip content="Modifica categoria?" placement="right" trigger={['hover', 'focus']}>
              <CButton
                color="secondary"
                variant="ghost"
                className="mb-3"
                size="sm"
                onClick={() => setVisibleChooseCategory(true)}
              >
                {label ? label.label : ''}
              </CButton>
            </CTooltip>
            <CFormInput
              value={formData.cr9b3_titolo ? formData.cr9b3_titolo : ''}
              maxLength={100}
              type="text"
              size="lg"
              placeholder="Titolo"
              className="mb-3"
              onChange={(e) => {
                setFormData({ ...formData, cr9b3_titolo: e.target.value })
                setPraticaEdits({ ...praticaEdits, cr9b3_titolo: e.target.value.trim() })
                setIsModified(true)
              }}
              required
            />
            <CInputGroup className="mb-3">
              <CInputGroupText id="istruzioni-superiori">Istruzioni:</CInputGroupText>
              <CFormInput
                value={formData.cr9b3_istruzionesuperiori ? formData.cr9b3_istruzionesuperiori : ''}
                aria-label="Istruzioni"
                aria-describedby="istruzioni-superiori"
                onChange={(e) => {
                  setFormData({ ...formData, cr9b3_istruzionesuperiori: e.target.value })
                  setPraticaEdits({
                    ...praticaEdits,
                    cr9b3_istruzionesuperiori: e.target.value.trim(),
                  })
                  setIsModified(true)
                }}
                maxLength={500}
                required
              />
            </CInputGroup>
          </>
        )}

        <CFormTextarea
          id="debrief"
          className="mb-3"
          label="Briefing:"
          rows={5}
          value={formData.cr9b3_debrief ? formData.cr9b3_debrief : ''}
          aria-label="debrief"
          aria-describedby="debrief"
          maxLength={1000}
          onChange={(e) => {
            setIsModified(true)
            setFormData({ ...formData, cr9b3_debrief: e.target.value })
            setPraticaEdits({ ...praticaEdits, cr9b3_debrief: e.target.value.trim() })
          }}
          readOnly={isView}
        />

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          {formData.cr9b3_status > 0 && (
            <CButton
              color={isView ? 'primary' : 'light'}
              className="mt-3"
              onClick={() => {
                if (!isView) {
                  setConfirmCloseBody({
                    ...confirmCloseBody,
                    text: 'Le tue modifiche potrebbero non essere salvate. Continuare?',
                  })
                  setConfirmAction('close')
                  showConfirmClose()
                } else {
                  setIsView(false)
                }
              }}
            >
              <CIcon icon={isView ? cilPencil : cilX} className="me-md-2" />
              {isView ? 'Modifica' : 'Annulla'}
            </CButton>
          )}
          {!isView && (
            <CButton className="mt-3" disabled={!isModified} type="submit">
              Salva modifiche
            </CButton>
          )}
          {isView && formData.cr9b3_status > 0 ? (
            <CTooltip content={'Elimina'} placement="top" trigger={['hover', 'focus']}>
              <CButton
                className="mt-3"
                variant="ghost"
                color="primary"
                onClick={() => {
                  setConfirmAction('archive')
                  setConfirmCloseBody({
                    ...confirmCloseBody,
                    text: 'Sei sicuro di voler eliminare questa pratica?',
                  })
                  showConfirmClose()
                }}
              >
                <CIcon icon={cilTrash} />
              </CButton>
            </CTooltip>
          ) : isView && formData.cr9b3_status === 0 ? (
            <>
              <CTooltip content={'Ripristinare'} placement="top" trigger={['hover', 'focus']}>
                <CButton
                  className="mt-3"
                  variant="ghost"
                  color="primary"
                  onClick={() => {
                    setConfirmAction('unarchive')
                    setConfirmCloseBody({
                      ...confirmCloseBody,
                      text: 'Sei sicuro di voler ripristinare questa pratica?',
                    })
                    showConfirmClose()
                  }}
                >
                  <CIcon icon={cilInbox} />
                </CButton>
              </CTooltip>
              <CTooltip content={'Elimina'} placement="top" trigger={['hover', 'focus']}>
                <CButton
                  className="mt-3"
                  color="primary"
                  onClick={() => {
                    setConfirmAction('delete')
                    setConfirmCloseBody({
                      ...confirmCloseBody,
                      text: 'Sei sicuro di voler eliminare definitivamente questa pratica? Questa operazione non può essere annullata.',
                    })
                    showConfirmClose()
                  }}
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTooltip>
            </>
          ) : (
            ''
          )}
        </div>
        <CContainer className="mt-5">
          {!isView ? (
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  value={formData.cr9b3_protno ? formData.cr9b3_protno : ''}
                  id="prot-no"
                  label="Initial prot. no."
                  onChange={(e) => {
                    setFormData({ ...formData, cr9b3_protno: e.target.value })
                    setPraticaEdits({ ...praticaEdits, cr9b3_protno: e.target.value })
                    setIsModified(true)
                  }}
                  maxLength={5}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  value={formData.cr9b3_prano ? formData.cr9b3_prano : ''}
                  label="Prat. no."
                  id="prat-no"
                  onChange={(e) => {
                    setFormData({ ...formData, cr9b3_prano: e.target.value })
                    setPraticaEdits({ ...praticaEdits, cr9b3_prano: e.target.value })
                    setIsModified(true)
                  }}
                  maxLength={5}
                  required
                />
              </CCol>
            </CRow>
          ) : (
            ''
          )}
          <CCol>
            <p>Ulteriori numeri di protocollo:</p>
            <ProtNos
              triggerUpdateProtNos={triggerUpdateProtNos}
              isView={isView}
              values={formData.cr9b3_protno2 ? JSON.parse(formData.cr9b3_protno2) : ['']}
            />
          </CCol>

          <CCol md={8} className="mb-3 mt-4">
            <CFormSelect
              aria-label="Status"
              label="Status:"
              value={formData.cr9b3_status ? formData.cr9b3_status : ''}
              options={[
                { label: 'Nuovo', value: '10' },
                { label: 'In corso', value: '30' },
                { label: 'In attesa di risposta dal destinatario', value: '50' },
                { label: 'In attesa di approvazione dal superiore', value: '70' },
                { label: 'In sospeso', value: '40' },
                { label: 'Archiviato', value: '0', disabled: true },
                { label: 'Completato', value: '100' },
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
          {isView && responsabileList.length !== 0 ? (
            responsabileList.map((s) => (
              <Person
                key={s.id}
                className="m-3"
                personQuery={s.mail}
                personCardInteraction="hover"
                showPresence={false}
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
                  // console.log('people picker set responsabile list', responsabileList)
                  setIsModified(true)
                }}
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
                  showPresence={false}
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
                    // console.log('people picker set officiale list', e.target.selectedPeople)
                    setIsModified(true)
                  }}
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
                {isView && superioriInvitatiList.length !== 0
                  ? superioriInvitatiList.map((s) => (
                      <Person
                        key={s.id}
                        className="m-3"
                        personQuery={s.mail}
                        personCardInteraction="hover"
                        showPresence={false}
                        view="twoLines"
                      />
                    ))
                  : !isView && (
                      <PeoplePicker
                        className="mt-2"
                        groupId="317aa3d0-a94a-4c7c-bcb9-8870cfececa4"
                        selectedPeople={superioriInvitatiList}
                        selectionChanged={(e) => {
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
                value={formData.cr9b3_enteinviante ? formData.cr9b3_enteinviante : ''}
                aria-label="Ente inviante"
                aria-describedby="ente-inviante"
                onChange={(e) => {
                  setFormData({ ...formData, cr9b3_enteinviante: e.target.value })
                  setPraticaEdits({ ...praticaEdits, cr9b3_enteinviante: e.target.value.trim() })
                  setIsModified(true)
                }}
                maxLength={100}
                disabled={isView}
                readOnly={isView}
              />
            </CInputGroup>
          )}
          {fields.ente_richiedente && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="ente-richiedente">Ente richiedente:</CInputGroupText>
              <CFormInput
                value={formData.cr9b3_enterichiedente ? formData.cr9b3_enterichiedente : ''}
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
                maxLength={100}
              />
            </CInputGroup>
          )}
          {fields.ente_ricevente && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="ente-ricevente">Ente ricevente:</CInputGroupText>
              <CFormInput
                value={formData.cr9b3_entericevente ? formData.cr9b3_entericevente : ''}
                aria-label="Ente ricevente"
                aria-describedby="ente-ricevente"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_entericevente: e.target.value })
                  setPraticaEdits({ ...praticaEdits, cr9b3_entericevente: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
                maxLength={100}
              />
            </CInputGroup>
          )}
          {fields.persona_richiedente && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="persona-richiedente">Persona richiedente:</CInputGroupText>
              <CFormInput
                value={formData.cr9b3_personarichiedente ? formData.cr9b3_personarichiedente : ''}
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
                maxLength={100}
              />
            </CInputGroup>
          )}
          {fields.destinatari && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="destinatari">Destinatari:</CInputGroupText>
              <CFormTextarea
                value={formData.cr9b3_destinatari ? formData.cr9b3_destinatari : ''}
                aria-label="Destinatari"
                aria-describedby="destinatari"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_destinatari: e.target.value })
                  setPraticaEdits({ ...praticaEdits, cr9b3_destinatari: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
                maxLength={1000}
              />
            </CInputGroup>
          )}
          {fields.indirizzi_destinatari && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="indirizzi-destinatari">Indirizzi destinatari:</CInputGroupText>
              <CFormTextarea
                value={
                  formData.cr9b3_indirizzidestinatari ? formData.cr9b3_indirizzidestinatari : ''
                }
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
                maxLength={1000}
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
                value={formData.cr9b3_titoloevento ? formData.cr9b3_titoloevento : ''}
                aria-label="Titolo evento"
                aria-describedby="titolo-evento"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_titoloevento: e.target.value })
                  setPraticaEdits({ ...praticaEdits, cr9b3_titoloevento: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
                maxLength={100}
              />
            </CInputGroup>
          )}
          {fields.luogo_evento && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="luogo-evento">Luogo evento:</CInputGroupText>
              <CFormInput
                value={formData.cr9b3_luogoevento ? formData.cr9b3_luogoevento : ''}
                aria-label="Luogo evento"
                aria-describedby="luogo-evento"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_luogoevento: e.target.value })
                  setPraticaEdits({ ...praticaEdits, cr9b3_luogoevento: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
                maxLength={100}
              />
            </CInputGroup>
          )}
          {fields.tema_contributo && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="tema-contributo">Tema del contributo:</CInputGroupText>
              <CFormInput
                value={formData.cr9b3_temacontributo ? formData.cr9b3_temacontributo : ''}
                aria-label="Tema del contributo"
                aria-describedby="tema-contributo"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_temacontributo: e.target.value })
                  setPraticaEdits({ ...praticaEdits, cr9b3_temacontributo: e.target.value.trim() })
                }}
                disabled={isView}
                readOnly={isView}
                maxLength={100}
              />
            </CInputGroup>
          )}
          {fields.materia_rapporto && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="materia-contributo">Materia del rapporto:</CInputGroupText>
              <CFormInput
                value={formData.cr9b3_materiarapporto ? formData.cr9b3_materiarapporto : ''}
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
                maxLength={100}
              />
            </CInputGroup>
          )}
          {fields.no_partecipanti && (
            <CInputGroup className="mb-3">
              <CInputGroupText id="no-partecipanti">No. partecipanti:</CInputGroupText>
              <CFormInput
                type="number"
                value={formData.cr9b3_nopartecipanti ? formData.cr9b3_nopartecipanti : ''}
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
            <CRow>
              <CCol md={6} className="mb-3">
                <p>Country:</p>
                <CountrySelect
                  defaultValue={country}
                  containerClassName="form-group"
                  inputClassName=""
                  onChange={(_country) => {
                    setCountry(_country)
                    setFormData({ ...formData, cr9b3_paese: _country.id.toString() })
                    setPraticaEdits({ ...praticaEdits, cr9b3_paese: _country.id.toString() })
                    setIsModified(true)
                    // setCurrentState({ id: null })
                    // setCurrentCity({ id: null })
                  }}
                  placeHolder="Select Country"
                  disabled={isView}
                />
              </CCol>
            </CRow>
          )}

          {fields.regione && (
            <CCol md={6} className="mb-3">
              <CFormInput
                label="Regione"
                value={formData.cr9b3_regione ? formData.cr9b3_regione : ''}
                aria-label="Regione"
                aria-describedby="regione"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_regione: e.target.value })
                  setPraticaEdits({
                    ...praticaEdits,
                    cr9b3_regione: e.target.value.trim(),
                  })
                }}
                disabled={isView}
                readOnly={isView}
                maxLength={100}
              />
            </CCol>
          )}
          {fields.citta && (
            <CCol md={6} className="mb-5">
              <CFormInput
                label="Città"
                value={formData.cr9b3_citta ? formData.cr9b3_citta : ''}
                aria-label="Citta"
                aria-describedby="citta"
                onChange={(e) => {
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_citta: e.target.value })
                  setPraticaEdits({
                    ...praticaEdits,
                    cr9b3_citta: e.target.value.trim(),
                  })
                }}
                disabled={isView}
                readOnly={isView}
                maxLength={100}
              />
            </CCol>
          )}

          <CRow className="mb-5">
            <CCol>
              <CFormInput
                id="cartella-principale"
                value={formData.cr9b3_sharepointlink ? formData.cr9b3_sharepointlink : ''}
                label="Link Sharepoint cartella principale:"
                aria-label="Sharepoint link"
                aria-describedby="sharepoint-link"
                onChange={(e) => {
                  const value = e.target.value
                  setIsValid(validateUrl(value))
                  setIsModified(true)
                  setFormData({ ...formData, cr9b3_sharepointlink: e.target.value })
                  setPraticaEdits({ ...praticaEdits, cr9b3_sharepointlink: e.target.value.trim() })
                }}
                feedbackInvalid="Inserisci un link SharePoint valido."
                disabled={isView}
                readOnly={isView}
                valid={isValid && !isView}
                invalid={!isValid}
                maxLength={1000}
                required
              />
            </CCol>
          </CRow>

          <CFormTextarea
            id="notes"
            label="Note:"
            rows={3}
            text="Ulteriori dettagli"
            value={formData.cr9b3_notes ? formData.cr9b3_notes : ''}
            maxLength={4000}
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
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            {formData.cr9b3_status > 0 && (
              <CButton
                color={isView ? 'primary' : 'light'}
                className="mt-3"
                onClick={() => {
                  if (!isView) {
                    setConfirmCloseBody({
                      ...confirmCloseBody,
                      text: 'Le modifiche potrebbero non essere state salvate. Continuare?',
                    })
                    setConfirmAction('close')
                    showConfirmClose()
                  } else {
                    setIsView(false)
                  }
                }}
              >
                <CIcon icon={isView ? cilPencil : cilX} className="me-md-2" />
                {isView ? 'Modifica' : 'Chiudi'}
              </CButton>
            )}
            {!isView && (
              <CButton className="mt-3" disabled={!isModified} type="submit">
                Salva modifiche
              </CButton>
            )}
            {isView && formData.cr9b3_status > 0 ? (
              <CTooltip content={'Elimina'} placement="top" trigger={['hover', 'focus']}>
                <CButton
                  className="mt-3"
                  variant="ghost"
                  color="primary"
                  onClick={() => {
                    setConfirmAction('archive')
                    setConfirmCloseBody({
                      ...confirmCloseBody,
                      text: 'Sei sicuro di voler archiviare questa pratica?',
                    })
                    showConfirmClose()
                  }}
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTooltip>
            ) : isView && formData.cr9b3_status === 0 ? (
              <>
                <CTooltip content={'Ripristinare'} placement="top" trigger={['hover', 'focus']}>
                  <CButton
                    className="mt-3"
                    variant="ghost"
                    color="primary"
                    onClick={() => {
                      setConfirmAction('unarchive')
                      setConfirmCloseBody({
                        ...confirmCloseBody,
                        text: "Sei sicuro di voler annullare l'archiviazione di questa pratica?",
                      })
                      showConfirmClose()
                    }}
                  >
                    <CIcon icon={cilInbox} />
                  </CButton>
                </CTooltip>
                <CTooltip content={'Elimina'} placement="top" trigger={['hover', 'focus']}>
                  <CButton
                    className="mt-3"
                    color="primary"
                    onClick={() => {
                      setConfirmAction('delete')
                      setConfirmCloseBody({
                        ...confirmCloseBody,
                        text: 'Sei sicuro di voler eliminare definitivamente questa pratica? Questa operazione non può essere annullata.',
                      })
                      showConfirmClose()
                    }}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTooltip>
              </>
            ) : (
              ''
            )}
          </div>
        </CContainer>
      </CForm>
    </>
  )
}

export default Fields
