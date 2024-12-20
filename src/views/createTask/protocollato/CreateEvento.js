/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { getAccessToken, createAxiosInstance } from 'src/util/axiosUtils'

import {
  CFormInput,
  CRow,
  CCol,
  CForm,
  CDatePicker,
  CFormTextarea,
  CFormSelect,
  CButton,
  CSpinner,
} from '@coreui/react-pro'
import { PeoplePicker } from '@microsoft/mgt-react'

import { getSystemUserID } from 'src/util/taskUtils'

const CreateEvento = ({ onCreate, categoria }) => {
  const [newPratica, setNewPratica] = useState({ cr9b3_categoria: categoria, cr9b3_status: 0 })
  const [superioriInvitati, setSuperioriInvitati] = useState([])
  const [responsabili, setResponsabili] = useState([])

  useEffect(() => {
    setNewPratica({ ...newPratica, cr9b3_istruzioneda: 'AS' })
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    // console.log('superiori invitati', superioriInvitati)
    // console.log('responsabili', responsabili)
    onCreate(newPratica, superioriInvitati, responsabili)
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
        <CRow className="mb-5">
          <CCol md={2}>
            <CFormInput
              id="prot-no"
              label="Prot. no."
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
        <CRow className="mb-3">
          <CCol md={5}>
            <CFormInput
              id="istruzione-superiori"
              label="Istruzione superiori"
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_istruzionesuperiori: e.target.value.trim() })
              }}
              required
            />
          </CCol>
          <CCol md={2}>
            <CFormSelect
              aria-label="Default select example"
              options={[
                { label: 'AS', value: 'AS' },
                { label: 'AE', value: 'AE' },
              ]}
              label="Da"
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_istruzioneda: e.target.value })
              }}
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
                console.log(e)
                setNewPratica({ ...newPratica, cr9b3_datatimbrosuperiore: e })
              }}
            />
          </CCol>
          <CCol md={3}>
            <CDatePicker
              id="data-prima-scadenza"
              label="Data prima scadenza"
              locale="it-IT"
              onDateChange={(e) => {
                console.log(e)
                setNewPratica({ ...newPratica, dssui_primascadenza: e })
              }}
            />
          </CCol>
        </CRow>
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
        <CRow className="mb-3">
          <CCol md={3}>
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
          <CCol md={5}>
            <CFormInput
              id="titolo-evento"
              label="Titolo evento"
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_titoloevento: e.target.value.trim() })
              }}
            />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={4}>
            <CFormInput
              id="ente-richiedente"
              label="Ente richiedente"
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_enterichiedente: e.target.value.trim() })
              }}
            />
          </CCol>
          <CCol md={4}>
            <CFormInput
              id="persona-richiedente"
              label="Persona richiedente"
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_personarichiedente: e.target.value.trim() })
              }}
            />
          </CCol>
        </CRow>
        <CRow className="mb-3">
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
            />
          </CCol>
        </CRow>

        <CRow className="mb-5">
          <CCol md={5}>
            <CFormInput
              id="cartella-principale"
              label="SharePoint link"
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_sharepointlink: e.target.value.trim() })
              }}
            />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={8}>
            <CFormTextarea
              id="corrispondenza"
              label="Corrispondenza"
              rows={5}
              onChange={(e) => {
                setNewPratica({ ...newPratica, cr9b3_corrispondenza: e.target.value.trim() })
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

export default CreateEvento
