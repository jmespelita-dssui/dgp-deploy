/* eslint-disable react/prop-types */
import { CFormSelect, CInputGroup, CInputGroupText } from '@coreui/react-pro'
import React from 'react'

const ProtocolledSelect = ({ onChangeCategoria }) => {
  return (
    <CInputGroup className="mb-3">
      <CInputGroupText id="categoria">Categoria</CInputGroupText>
      <CFormSelect
        aria-label="Default select example"
        defaultValue={'Choose category'}
        options={[
          { label: 'Choose category', value: '0' },
          { label: 'EVENTO - viaggio estero/italia/roma', value: '3' },
          { label: 'RICHIESTA CONTRIBUTO - articolo/messaggio', value: '1' },
          { label: 'VISITA - ogni tipo di partner', value: '5' },
          { label: 'RICEZIONE DI RAPPORTI - partners, perm miss, Ap. N.', value: '4' },
          { label: 'PROGETTO ESTERNO', value: '2' },
          {
            label: 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invito evento)',
            value: '6',
          },
          {
            label: 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invio lettera)',
            value: '7',
          },
        ]}
        onChange={(e) => {
          onChangeCategoria(e.target.value)
        }}
      />
    </CInputGroup>
  )
}

export default ProtocolledSelect
