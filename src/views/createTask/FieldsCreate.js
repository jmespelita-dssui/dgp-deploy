/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

import {
  CFormInput,
  CRow,
  CCol,
  CForm,
  CDatePicker,
  CFormTextarea,
  CFormSelect,
  CButton,
} from '@coreui/react-pro'
import { PeoplePicker } from '@microsoft/mgt-react'
import { useToast } from 'src/context/ToastContext'

import { CountrySelect } from 'react-country-state-city'
// import { GetCountries } from 'react-country-state-city'
import 'react-country-state-city/dist/react-country-state-city.css'

import ProtNos from './ProtNos'

const FieldsCreate = ({ onCreate, categoria, fields }) => {
  const [newPratica, setNewPratica] = useState({ cr9b3_sharepointlink: '' })
  const [superioriInvitati, setSuperioriInvitati] = useState([])
  const [responsabili, setResponsabili] = useState([])
  const [protNos, setProtNos] = useState(0)
  const [protNoValues, setProtNoValues] = useState(['']) // Stores input values
  const [isValid, setIsValid] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    setNewPratica({
      ...newPratica,
      cr9b3_status: 10,
      cr9b3_categoria: categoria,
    })
  }, [categoria])

  const triggerUpdateProtNos = (e) => {
    setProtNoValues(e)
    console.log(e)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (isValid) {
      onCreate(
        { ...newPratica, cr9b3_protno2: JSON.stringify(protNoValues) },
        superioriInvitati,
        responsabili,
      )
    } else {
      addToast('Please insert valid SharePoint link', 'Create Pratica', 'warning')
    }
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
      <CForm className="p-3" onSubmit={onSubmit}>
        <CRow className="mb-4">
          <CCol md={8}>
            <CFormInput
              type="text"
              size="lg"
              placeholder="Titolo"
              className="mt-4"
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_titolo: e.target.value.trim() })
              }}
              required
            />
          </CCol>
        </CRow>
        {fields.superiori_invitati && (
          <CRow className="mb-3">
            <CCol md={4}>
              Superiori invitati{' '}
              <PeoplePicker
                className="mt-2"
                groupId="317aa3d0-a94a-4c7c-bcb9-8870cfececa4"
                selectionChanged={(e) => {
                  setSuperioriInvitati(e.target.selectedPeople)
                }}
              />
              {/* <CFormInput id="superiori-invitati" label="Superiori invitati" /> */}
            </CCol>
          </CRow>
        )}
        <CRow className="mb-3">
          <CCol md={2}>
            <CFormInput
              id="prot-no"
              label="Initial prot. no."
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_protno: e.target.value })
              }}
              maxLength={5}
              required
            />
          </CCol>
          <CCol md={2}>
            <CFormInput
              label="Prat. no."
              id="prat-no"
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_prano: e.target.value })
              }}
              maxLength={5}
              required
            />
          </CCol>
        </CRow>
        <ProtNos triggerUpdateProtNos={triggerUpdateProtNos} />

        <CRow className="mb-3">
          <CCol md={5}>
            <CFormInput
              id="istruzione-superiori"
              label="Istruzione superiori"
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_istruzionesuperiori: e.target.value.trim() })
              }}
              maxLength={200}
              required
            />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={3}>
            <CDatePicker
              id="data-timbro-superiore"
              label="Data timbro Superiore"
              locale="it-IT"
              onDateChange={(e) => {
                // console.log(e)
                setNewPratica({ ...newPratica, cr9b3_datatimbrosuperiore: e })
              }}
            />
          </CCol>
          {fields.data_prima_scadenza && (
            <CCol md={3}>
              <CDatePicker
                id="data-prima-scadenza"
                label="Data prima scadenza"
                locale="it-IT"
                onDateChange={(e) => {
                  // console.log(e)
                  setNewPratica({ ...newPratica, dssui_primascadenza: e })
                }}
              />
            </CCol>
          )}
        </CRow>
        <CRow className="mb-5">
          {fields.data_invio_materiale && (
            <CCol md={3} className="mb-3">
              <CDatePicker
                id="data-invio-materiale"
                label="Scadenza invio del materiale:"
                locale="it-IT"
                onDateChange={(e) => {
                  setNewPratica({
                    ...newPratica,
                    cr9b3_datainviomateriale: e,
                    dssui_primascadenza: e,
                  })
                }}
              />
            </CCol>
          )}
          {fields.data_richiesta_contributo && (
            <CCol md={3} className="mb-3">
              <CDatePicker
                id="data-richiesta-contributo"
                label="Scadenza richiesta contributo:"
                locale="it-IT"
                onDateChange={(e) => {
                  setNewPratica({
                    ...newPratica,
                    cr9b3_datarichiestacontributo: e,
                    dssui_primascadenza: e,
                  })
                }}
              />
            </CCol>
          )}
          {fields.data_evento && (
            <CCol md={3} className="mb-3">
              <CDatePicker
                id="data-evento"
                label="Data evento"
                locale="it-IT"
                onDateChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_dataevento: e })
                }}
                timepicker
              />
            </CCol>
          )}
          {fields.titolo_evento && (
            <CCol md={5} className="mb-3">
              <CFormInput
                id="titolo-evento"
                label="Titolo evento"
                onChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_titoloevento: e.target.value.trim() })
                }}
                maxLength={100}
              />
            </CCol>
          )}
          {fields.luogo_evento && (
            <CCol md={5} className="mb-3">
              <CFormInput
                id="luogo-evento"
                label="Luogo evento"
                onChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_luogoevento: e.target.value.trim() })
                }}
                maxLength={100}
              />
            </CCol>
          )}
          {fields.tema_contributo && (
            <CCol md={5} className="mb-3">
              <CFormInput
                id="tema-contributo"
                label="Tema del contributo"
                onChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_temacontributo: e.target.value.trim() })
                }}
                maxLength={100}
              />
            </CCol>
          )}
          {fields.materia_contributo && (
            <CCol md={5} className="mb-3">
              <CFormInput
                id="materia-contributo"
                label="Materia del contributo"
                onChange={(e) => {
                  setNewPratica({
                    ...newPratica,
                    cr9b3_materiacontributo: e.target.value.trim(),
                  })
                }}
                maxLength={100}
              />
            </CCol>
          )}
          {fields.materia_rapporto && (
            <CCol md={5} className="mb-3">
              <CFormInput
                id="materia-rapporto"
                label="Materia del rapporto"
                onChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_materiarapporto: e.target.value.trim() })
                }}
                maxLength={100}
              />
            </CCol>
          )}
          {fields.no_partecipanti && (
            <CCol md={5} className="mb-3">
              <CFormInput
                id="no-partecipanti"
                label="No. partecipanti"
                onChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_nopartecipanti: e.target.value.trim() })
                }}
                type="number"
              />
            </CCol>
          )}
        </CRow>
        {fields.paese && (
          <>
            <CRow>
              <CCol md={4} className="mb-3">
                <span>Country</span>
                <CountrySelect
                  containerClassName="form-group"
                  inputClassName=""
                  onChange={(_country) => {
                    setNewPratica({ ...newPratica, cr9b3_paese: _country.id.toString() })
                    // setCountry(_country)
                  }}
                  placeHolder="Select Country"
                />
              </CCol>
              {fields.regione && (
                <CCol md={4} className="mb-3">
                  <CFormInput
                    label="Regione"
                    id="regione"
                    onChange={(e) => {
                      setNewPratica({ ...newPratica, cr9b3_regione: e.target.value })
                    }}
                    maxLength={100}
                  />
                </CCol>
              )}
              {fields.citta && (
                <CCol md={4} className="mb-5">
                  <CFormInput
                    label="Città"
                    id="citta"
                    onChange={(e) => {
                      setNewPratica({ ...newPratica, cr9b3_citta: e.target.value })
                    }}
                    maxLength={100}
                  />
                </CCol>
              )}
            </CRow>
          </>
        )}

        <CRow className="mb-3">
          {fields.ente_inviante && (
            <CCol md={4} className="mb-3">
              <CFormInput
                id="ente-inviante"
                label="Ente inviante"
                onChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_enteinviante: e.target.value.trim() })
                }}
                maxLength={100}
              />
            </CCol>
          )}
          {fields.ente_richiedente && (
            <CCol md={4} className="mb-3">
              <CFormInput
                id="ente-richiedente"
                label="Ente richiedente"
                onChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_enterichiedente: e.target.value.trim() })
                }}
                maxLength={100}
              />
            </CCol>
          )}
          {fields.ente_ricevente && (
            <CCol md={4} className="mb-3">
              <CFormInput
                id="ente-ricevente"
                label="Ente ricevente"
                onChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_entericevente: e.target.value.trim() })
                }}
                maxLength={100}
              />
            </CCol>
          )}
          {fields.persona_richiedente && (
            <CCol md={4} className="mb-3">
              <CFormInput
                id="persona-richiedente"
                label="Persona richiedente"
                onChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_personarichiedente: e.target.value.trim() })
                }}
                maxLength={100}
              />
            </CCol>
          )}
        </CRow>
        {fields.destinatari && (
          <CRow className="mb-5">
            <CCol md={5}>
              <CFormTextarea
                label="Destinatari"
                aria-label="Destinatari"
                aria-describedby="destinatari"
                onChange={(e) => {
                  setNewPratica({ ...newPratica, cr9b3_destinatari: e.target.value.trim() })
                }}
                maxLength={1000}
              />
            </CCol>
            {fields.indirizzi_destinatari && (
              <CCol md={5}>
                <CFormTextarea
                  label="Indirizzi destinatari"
                  aria-label="Indirizzi destinatari"
                  aria-describedby="indirizzi-destinatari"
                  onChange={(e) => {
                    setNewPratica({
                      ...newPratica,
                      cr9b3_indirizzidestinatari: e.target.value.trim(),
                    })
                  }}
                  maxLength={1000}
                />
              </CCol>
            )}
          </CRow>
        )}
        <CRow className="mb-5">
          <CCol md={4}>
            Responsabile sezione
            <PeoplePicker
              className="mt-2"
              groupId="2e227ba3-c594-4117-b106-d9735ddf4d26"
              selectionChanged={(e) => {
                setResponsabili(e.target.selectedPeople)
              }}
            />
          </CCol>
          <CCol md={3}>
            <CDatePicker
              id="data-inoltrato"
              label="Data inoltrato al responsabile"
              locale="it-IT"
              onDateChange={(e) => {
                setNewPratica({
                  ...newPratica,
                  cr9b3_datainoltrataresponsabile: e,
                })
              }}
              required={responsabili.length > 0}
            />
          </CCol>
        </CRow>
        {/* {fields.dssui_partecipanti && (
          <CRow className="mb-5">
            <CCol md={4}>
              Partecipanti DSSUI
              <PeoplePicker
                className="mt-2"
                groupId="7430b06a-2d45-4576-b6d9-dd969da4d43b"
                selectionChanged={(e) => {
                  setDssuiPartecipanti(e.target.selectedPeople)
                }}
              />
            </CCol>
          </CRow>
        )} */}

        <CRow className="mb-5">
          <CCol md={5}>
            <CFormInput
              id="cartella-principale"
              label="SharePoint link"
              onChange={(e) => {
                const value = e.target.value
                setIsValid(validateUrl(value))
                setNewPratica({ ...newPratica, cr9b3_sharepointlink: e.target.value.trim() })
              }}
              feedbackInvalid="Please insert a valid SharePoint link."
              invalid={!isValid && newPratica.cr9b3_sharepointlink !== ''}
              valid={isValid}
              maxLength={1000}
              required
            />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={8}>
            <CFormTextarea
              id="briefing"
              label="Briefing"
              rows={5}
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_debrief: e.target.value.trim() })
              }}
            />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={8}>
            <CFormTextarea
              id="notes"
              label="Notes"
              rows={5}
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_notes: e.target.value.trim() })
              }}
            />
          </CCol>
        </CRow>
        <CCol md={8} className="d-grid gap-2 d-md-flex justify-content-md-end">
          <CButton color="primary" type="submit">
            Create pratica
          </CButton>
        </CCol>
      </CForm>
    </>
  )
}

export default FieldsCreate
