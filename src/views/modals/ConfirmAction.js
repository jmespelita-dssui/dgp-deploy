/* eslint-disable react/prop-types */
import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react-pro'

const ConfirmAction = ({ visible, body, onCancel, onContinue }) => {
  return (
    <CModal visible={visible} alignment="center" backdrop="static">
      <CModalHeader closeButton={false}>
        <CModalTitle> {body.title} </CModalTitle>
      </CModalHeader>
      <CModalBody className="m-3">
        <p>{body.text}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel}>
          Annulla
        </CButton>
        <CButton color="primary" onClick={onContinue}>
          Continua
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmAction
