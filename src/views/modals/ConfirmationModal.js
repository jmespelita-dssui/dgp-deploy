/* eslint-disable react/prop-types */
import {
  CButton,
  CCol,
  CForm,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import React, { useState } from 'react'

const ConfirmationModal = ({ visible, onClose, onSubmit, popupMsg }) => {
  return (
    <>
      <CModal visible={visible} size="sm" backdrop="static" onClose={onClose}>
        <CModalHeader>
          <CModalTitle>Salva modifiche</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="add-user row g-3 needs-validation" onSubmit={() => onSubmit}>
            <CCol md={12}>Mark subtask as complete?</CCol>
            <CCol xs={12} className="modal-footer">
              <CButton color="secondary" onClick={onClose}>
                No
              </CButton>
              <CButton color="primary" type="submit">
                Si
              </CButton>
            </CCol>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default ConfirmationModal
