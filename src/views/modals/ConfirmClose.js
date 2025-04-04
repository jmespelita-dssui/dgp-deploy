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

const ConfirmClose = ({ visible, body, onCancel, onContinue }) => {
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
          Back
        </CButton>
        <CButton color="primary" onClick={onContinue}>
          Continue
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmClose
