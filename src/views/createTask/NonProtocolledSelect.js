/* eslint-disable react/prop-types */
import { CFormSelect, CInputGroup, CInputGroupText } from '@coreui/react-pro'
import React from 'react'

const NonProtocolledSelect = ({ onChangeCategoriaNP }) => {
  return (
    <>
      <CInputGroup className="mb-3">
        <CInputGroupText id="categoria">Categoria</CInputGroupText>
        <CFormSelect
          aria-label="Default select example"
          defaultValue={'Choose category'}
          options={[
            { label: 'Choose category', value: '0' },
            {
              label: 'RICHIESTA CONTRIBUTO - intervista/pubblicazioni su riviste',
              value: '129580000',
            },
            { label: 'PURTROPPO - richiesta evento/contributo/altro', value: '129580007' },
            {
              label: 'RAPPORTI/DOCUMENTI/INVITI GENERICI - partners, newsletters',
              value: '129580009',
            },
            { label: 'MESSAGGI PONTIFICI', value: '129580009' },
          ]}
          onChange={(e) => {
            onChangeCategoriaNP(e.target.value)
          }}
        />
      </CInputGroup>
    </>
  )
}

export default NonProtocolledSelect
