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
            { label: 'RICHIESTA CONTRIBUTO - intervista/pubblicazioni su riviste', value: '8' },
            { label: 'PURTROPPO - richiesta evento/contributo/altro', value: '9' },
            { label: 'RAPPORTI/DOCUMENTI/INVITI GENERICI - partners, newsletters', value: '10' },
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
