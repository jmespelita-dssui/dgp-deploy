/* eslint-disable react/prop-types */
import React from 'react'
import {
  CFormInput,
  CRow,
  CCol,
  CForm,
  CDatePicker,
  CFormTextarea,
  CFormSelect,
} from '@coreui/react-pro'
import { FileList, PeoplePicker, Providers, ProviderState } from '@microsoft/mgt-react'

const CreateVisita = ({ superiors, responsibles }) => {
  return (
    <>
      <CForm className="row p-3">
        <CRow className="mb-3">
          <CCol md={2}>
            <CFormInput id="prot-no" label="Prot. no. " />
          </CCol>
          <CCol md={2}>
            <CFormInput id="prat-no" label="Prat. no. " />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={4}>
            Superiori invitati <PeoplePicker className="mt-2" people={superiors} />
            {/* <CFormInput id="superiori-invitati" label="Superiori invitati" /> */}
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={5}>
            <CFormInput id="istruzione-superiori" label="Istruzione superiori" required />
          </CCol>
          <CCol md={2}>
            <CFormSelect
              aria-label="Default select example"
              options={[
                { label: 'AS', value: 'AS' },
                { label: 'AE', value: 'AE' },
              ]}
              label="Da"
            />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={3}>
            <CDatePicker id="data-iniziale" label="Data timbro Segretario" locale="it-IT" />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={4}>
            <CFormInput id="ente-richiedente" label="Ente richiedente" />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={4}>
            <CFormInput id="persona-richiedente" label="Persona richiedente" />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={5}>
            <CFormInput id="titolo-evento" label="Titolo evento" />
          </CCol>

          <CCol md={3}>
            <CDatePicker id="data-richiesta" label="Data evento" locale="it-IT" />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={3}>
            <CFormInput id="numero-partecipanti" label="No. di partecipanti/ospiti" />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={4}>
            Responsabile sezione <PeoplePicker className="mt-2" people={responsibles} />
          </CCol>
          <CCol md={3}>
            <CDatePicker
              id="data-inoltrata"
              label="Data inoltrata al responsabile"
              locale="it-IT"
            />
          </CCol>
        </CRow>

        <CRow className="mb-5">
          <CCol md={5}>
            <CFormInput id="cartella-principale" label="SharePoint link" />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={8}>
            <CFormTextarea id="corrispondenza" label="Corrispondenza" rows={5} />
          </CCol>
        </CRow>
      </CForm>
    </>
  )
}

export default CreateVisita
