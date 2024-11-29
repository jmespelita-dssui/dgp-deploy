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
import { PeoplePicker } from '@microsoft/mgt-react'

const CreateNPGenerici = () => {
  return (
    <>
      <CForm className="row p-3">
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
            <CDatePicker id="data-prima-scadenza" label="Data scadenza invio" locale="it-IT" />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={4}>
            <CFormTextarea id="nomi-destinatari" label="Nomi destinatari" rows={2} />
          </CCol>
          <CCol md={4}>
            <CFormTextarea id="indirizzi-destinatari" label="Indirizzi destinatari" rows={2} />
          </CCol>
        </CRow>

        <CRow className="mb-5">
          <CCol md={4}>
            Responsabile sezione
            <PeoplePicker className="mt-2" groupId="2e227ba3-c594-4117-b106-d9735ddf4d26" />
          </CCol>
          <CCol md={3}>
            <CDatePicker
              id="data-inoltrato"
              label="Data inoltrato al responsabile"
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

export default CreateNPGenerici
