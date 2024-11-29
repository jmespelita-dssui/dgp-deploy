/* eslint-disable react/prop-types */
import React from 'react'

import { CInputGroup, CInputGroupText, CFormInput, CCardBody, CRow } from '@coreui/react-pro'

const ProgettoEsterno = ({ pratica }) => {
  return (
    <>
      <CInputGroup className="mb-3 mt-4">
        <CInputGroupText id="data-iniziale">Data iniziale:</CInputGroupText>
        <CFormInput
          placeholder={pratica.crebd_datacreazione}
          aria-label="Data iniziale"
          aria-describedby="data-iniziale"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="ente-inviante">Ente inviante:</CInputGroupText>
        <CFormInput
          placeholder={pratica.crebd_enteinviante}
          aria-label="Ente inviante"
          aria-describedby="ente-inviante"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="materia-rapporto">Materia del rapporto:</CInputGroupText>
        <CFormInput
          placeholder={pratica.crebd_materiarapporto}
          aria-label="Materia del rapporto"
          aria-describedby="materia-rapporto"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="persona-diocesi">Persona diocesi:</CInputGroupText>
        <CFormInput
          placeholder={pratica.crebd_diocesi}
          aria-label="Persona diocesi"
          aria-describedby="persona-diocesi"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="sezione-responsabile">Sezione responsabile:</CInputGroupText>
        <CFormInput
          placeholder={pratica.crebd_responsabilesezione}
          aria-label="Sezione responsabile"
          aria-describedby="sezione-responsabile"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="officiale-incaricato">Officiale incaricato:</CInputGroupText>
        <CFormInput
          placeholder={pratica.officiale_incaricato}
          aria-label="Officiale incaricato"
          aria-describedby="officiale-incaricato"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="paese">Paese:</CInputGroupText>
        <CFormInput placeholder={pratica.crebd_paese} aria-label="Paese" aria-describedby="paese" />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="regione">Regione:</CInputGroupText>
        <CFormInput
          placeholder={pratica.crebd_regione}
          aria-label="Regione"
          aria-describedby="regione"
        />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="citta">Città:</CInputGroupText>
        <CFormInput placeholder={pratica.crebd_citta} aria-label="Citta" aria-describedby="citta" />
      </CInputGroup>
      <CInputGroup className="mb-3">
        <CInputGroupText id="superiori-invitati">Superiori invitati:</CInputGroupText>
        <CFormInput
          placeholder={pratica.superioriinvitati}
          aria-label="Username"
          aria-describedby="superiori-invitati"
        />
      </CInputGroup>
    </>
  )
}

export default ProgettoEsterno
