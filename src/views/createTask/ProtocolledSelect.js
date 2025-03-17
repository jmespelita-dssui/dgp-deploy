/* eslint-disable react/prop-types */
import { CFormSelect, CInputGroup, CInputGroupText } from '@coreui/react-pro'
import React from 'react'

const ProtocolledSelect = ({ onChangeCategoria, isEdit, cat }) => {
  return (
    <CInputGroup className="mb-3">
      <CInputGroupText id="categoria">Categoria</CInputGroupText>
      <CFormSelect
        aria-label="Default select example"
        defaultValue={isEdit ? cat : '0'}
        options={[
          { label: 'Choose category', value: '0' },
          { label: 'EVENTO - viaggio estero/italia/roma', value: '129580002' },
          { label: 'RICHIESTA CONTRIBUTO - articolo/messaggio', value: '129580000' },
          { label: 'VISITA - ogni tipo di partner', value: '129580004' },
          { label: 'RICEZIONE DI RAPPORTI - partners, perm miss, Ap. N.', value: '129580003' },
          { label: 'PROGETTO ESTERNO', value: '129580001' },
          {
            label: 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invito evento)',
            value: '129580005',
          },
          {
            label: 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invio lettera)',
            value: '129580006',
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
