import React from 'react'

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
const CreateNPPurtroppo = () => {
  return (
    <>
      <CForm className="row p-3">
        <CRow className="mb-5">
          <CCol md={3}>
            <CDatePicker id="data-iniziale" label="Data della richiesta" locale="it-IT" required />
          </CCol>
        </CRow>
        <CRow className="mb-5">
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
        <CRow className="mb-3">
          <CCol md={4}>
            <CFormInput id="ente-richiedente" label="Ente richiedente" />
          </CCol>
          <CCol md={4}>
            <CFormInput id="persona-richiedente" label="Persona richiedente" />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={3}>
            <CDatePicker id="data-richiesta" label="Data evento" locale="it-IT" />
          </CCol>
          <CCol md={5}>
            <CFormInput id="titolo-evento" label="Titolo evento" />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={5}>
            <CDatePicker
              id="data-inoltrato"
              label="Data inoltrato alla Segreteria di Direzione"
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
        <CCol md={8} className="d-grid gap-2 d-md-flex justify-content-md-end">
          <CButton color="primary" type="submit">
            Create pratica
          </CButton>
        </CCol>
      </CForm>
    </>
  )
}

export default CreateNPPurtroppo
