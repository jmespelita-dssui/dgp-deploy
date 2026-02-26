/* eslint-disable react/prop-types */
import {
  CButton,
  CForm,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import { PeoplePicker } from '@microsoft/mgt-react'
import React, { useEffect, useState } from 'react'

const AddNewAccess = ({ visible, onCancel, onContinue }) => {
  const [selectedPeople, setSelectedPeople] = useState([])
  const [role, setRole] = useState()

  useEffect(() => {
    if (!visible) {
      setSelectedPeople([])
      setRole()
    }
  }, [visible])

  const prepUser = () => {
    const people = selectedPeople.map((person) => {
      // console.log('hey!', person)
      return { id: person.id, mail: person.mail, role }
    })
    onContinue(people)
  }

  return (
    <CModal visible={visible} alignment="center" backdrop="static">
      <CForm>
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
              required
            >
              <option>Seleziona ruolo</option>
              <option value={129580000}>Amministratore</option>
              <option value={129580001}>Utente avanzato</option>
              <option value={129580002}>Supervisore</option>
            </CFormSelect>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onCancel}>
            Annulla
          </CButton>
          <CButton color="primary" onClick={() => prepUser()} disabled={!role}>
            Continua
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default AddNewAccess
