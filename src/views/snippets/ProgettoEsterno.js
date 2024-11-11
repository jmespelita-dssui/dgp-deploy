/* eslint-disable react/prop-types */
import React from 'react'

import { CInputGroup, CInputGroupText, CFormInput, CCardBody, CRow } from '@coreui/react-pro'

const ProgettoEsterno = ({ pratica }) => {
  return (
    <>
      <CInputGroup className="mb-3 mt-4">
        <CInputGroupText id="basic-addon1">Data iniziale:</CInputGroupText>
        <CFormInput
          placeholder={pratica.timbro_segretario}
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">Ente inviante:</CInputGroupText>
        <CFormInput
          placeholder={pratica.ente_inviante}
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">Materia del rapporto:</CInputGroupText>
        <CFormInput
          placeholder={pratica.materia_rapporto}
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">Persona diocesi:</CInputGroupText>
        <CFormInput
          placeholder={pratica.diocesi}
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">Sezione responsabile:</CInputGroupText>
        <CFormInput
          placeholder={pratica.responsabile}
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">Officiale incaricato:</CInputGroupText>
        <CFormInput
          placeholder={pratica.officiale_incaricato}
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">Paese:</CInputGroupText>
        <CFormInput
          placeholder={pratica.paese}
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">Regione:</CInputGroupText>
        <CFormInput
          placeholder={pratica.regione}
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">Città:</CInputGroupText>
        <CFormInput
          placeholder={pratica.città}
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="basic-addon1">Superiori invitati:</CInputGroupText>
        <CFormInput
          placeholder={pratica.città}
          aria-label="Username"
          aria-describedby="basic-addon1"
        />
      </CInputGroup>
    </>
  )
}

export default ProgettoEsterno
