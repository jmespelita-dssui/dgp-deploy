/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CListGroup,
  CListGroupItem,
  CContainer,
  CFormSwitch,
} from '@coreui/react-pro'

const ConfirmAccess = ({ visible, notif, onCancel, onContinue }) => {
  const [response, setResponse] = useState('access granted')
  return (
    <CModal visible={visible} alignment="center" backdrop="static">
      <CModalHeader closeButton={false}>
        <CModalTitle> Consenti accesso </CModalTitle>
      </CModalHeader>
      <CModalBody className="m-3">
        <p>Consentire accesso a {notif.cr9b3_actor}? </p>{' '}
        <CFormSwitch
          label="Si/no"
          id="giveAccess"
          size="lg"
          defaultChecked
          onChange={(e) => setResponse(e.target.checked)}
        />
        <CContainer className="mt-3 mb-3">
          <CListGroup flush>
            <CListGroupItem>
              <strong>{notif.pratica.cr9b3_titolo} </strong>
            </CListGroupItem>
            <CListGroupItem>
              <strong>Prot. no. {notif.pratica.cr9b3_protno}</strong>
            </CListGroupItem>
            <CListGroupItem>Istruzioni: {notif.pratica.cr9b3_istruzionesuperiori}</CListGroupItem>
            {notif.pratica.cr9b3_debrief && (
              <CListGroupItem>{notif.pratica.cr9b3_debrief}</CListGroupItem>
            )}
          </CListGroup>
        </CContainer>
      </CModalBody>
      <CModalFooter>
        <CButton color="light" onClick={onCancel}>
          Annulla
        </CButton>
        <CButton color="primary" onClick={() => onContinue(response)}>
          Salva
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmAccess
