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
import { PeoplePicker } from '@microsoft/mgt-react'
import React, { useState } from 'react'

const AddNewAccess = ({ visible, onCancel, onContinue }) => {
  const [selectedPeople, setSelectedPeople] = useState([])
  const [role, setRole] = useState(0)

  const prepUser = () => {
    const mails = selectedPeople.map((person) => {
      return { mail: person.mail, role }
    })
    onContinue(mails)
  }

  return (
    <CModal visible={visible} alignment="center" backdrop="static">
      <CModalHeader closeButton={false}>
        <CModalTitle> Aggiungi nuovo accesso </CModalTitle>
      </CModalHeader>
      <CModalBody className="m-3">
        <p>Seleziona un utente e assegna un ruolo.</p>
        <PeoplePicker
          className="mt-2"
          groupId="7430b06a-2d45-4576-b6d9-dd969da4d43b"
          selectionChanged={(e) => {
            const people = e.detail ?? []
            setSelectedPeople(people)
          }}
        />
        {selectedPeople && (
          <CFormSelect
            className="mt-3"
            aria-label="Select role"
            onChange={(e) => setRole(parseInt(e.target.value))}
          >
            <option>Seleziona ruolo</option>
            <option value={129580000}>Amministratore</option>
            <option value={129580001}>Manager</option>
            <option value={129580002}>Responsabile</option>
          </CFormSelect>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onCancel}>
          Annulla
        </CButton>
        <CButton color="primary" onClick={() => prepUser()}>
          Continua
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddNewAccess
