/* eslint-disable react/prop-types */
import {
  CButton,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import { PeoplePicker, Person } from '@microsoft/mgt-react'
import React, { useState } from 'react'

const EditAccess = ({ visible, onCancel, onContinue, user }) => {
  const [role, setRole] = useState(0)
  const [isModified, setIsModified] = useState(false)

  return (
    <CModal visible={visible} alignment="center" backdrop="static">
      <CModalHeader closeButton={false}>
        <CModalTitle> Modifica accesso </CModalTitle>
      </CModalHeader>
      <CModalBody className="m-3">
        {user && (
          <>
            <Person personQuery={user.cr9b3_userid} view="twoLines" />
            <CFormSelect
              className="mt-3"
              aria-label="Select role"
              onChange={(e) => {
                setIsModified(true)
                setRole(parseInt(e.target.value))
                console.log(e.target.value)
              }}
              defaultValue={user.cr9b3_role}
            >
              <option disabled>Seleziona ruolo</option>
              <option value={129580000}>Amministratore</option>
              <option value={129580001}>Utente avanzato</option>
              <option value={129580002}>Supervisore</option>
            </CFormSelect>
          </>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel}>
          Annulla
        </CButton>
        <CButton
          color="primary"
          onClick={() => {
            if (isModified) {
              onContinue(role)
            } else {
              onCancel()
            }
          }}
        >
          Continua
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default EditAccess
