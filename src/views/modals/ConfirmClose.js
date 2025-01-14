/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react-pro'

const ConfirmClose = ({ visible, body, onCancel, onExit }) => {
  return (
    <CModal visible={visible} alignment="center" backdrop="static">
      <CModalHeader closeButton={false}>
        <CModalTitle> {body.title} </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>{body.text}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel}>
          Back
        </CButton>
        <CButton color="primary" onClick={onExit}>
          Continue
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmClose
