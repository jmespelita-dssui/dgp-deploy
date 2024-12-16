/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
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
import { CountrySelect } from 'react-country-state-city'
import 'react-country-state-city/dist/react-country-state-city.css'

const CreateProgettoEsterno = () => {
  const [countryid, setCountryid] = useState(0)

  return (
    <>
      <CForm className="row p-3">
        <CRow className="mb-3">
          <CCol md={2}>
            <CFormInput id="prot-no" label="Prot. no. " required />
          </CCol>
          <CCol md={2}>
            <CFormInput id="prat-no" label="Prat. no. " required />
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
              required
            />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={3}>
            <CDatePicker id="data-iniziale" label="Data timbro Superiore" locale="it-IT" />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={4}>
            <CFormInput id="ente-inviante" label="Ente inviante" />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={4}>
            <CountrySelect
              onChange={(e) => {
                setCountryid(e.id)
              }}
              placeHolder="Select Country"
            />
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol md={4}>
            Responsabile sezione{' '}
            <PeoplePicker className="mt-2" groupId="2e227ba3-c594-4117-b106-d9735ddf4d26" />
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
        <CCol md={8} className="d-grid gap-2 d-md-flex justify-content-md-end">
          <CButton color="primary" type="submit">
            Create pratica
          </CButton>
        </CCol>
      </CForm>
    </>
  )
}

export default CreateProgettoEsterno
