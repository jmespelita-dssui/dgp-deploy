/* eslint-disable react/prop-types */
import {
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react-pro'
import React, { useEffect, useState } from 'react'

const LinkModal = ({ visible, onClose, action, link, type, saveLink }) => {
  const [label, setLabel] = useState('')
  const [url, setURL] = useState('')
  const [isModified, setIsModified] = useState(false)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    refreshFields()
  }, [link])

  const refreshFields = () => {
    setIsModified(false)
    setIsValid(validateUrl(url))
    if (action === 'edit') {
      setLabel(link.label)
      setURL(link.url)
    } else {
      setLabel('')
      setURL('')
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    let newLink = {
      id: action === 'add' ? Math.random().toString(36).slice(2, 9) : link.id,
      type: type,
      label: label.trim(),
      url: url,
    }
    saveLink(action, newLink)
    onClose()
    refreshFields()
  }

  // Validate URL using the URL object
  const validateUrl = () => {
    try {
      new URL(url) // If valid, no error is thrown
      setIsValid(true)
    } catch {
      setIsValid(false)
    }
  }

  return (
    <>
      <CModal backdrop="static" alignment="center" visible={visible}>
        <CForm onSubmit={onSubmit}>
          <CModalHeader closeButton={false}>
            <CModalTitle>{action === 'add' ? 'Add' : 'Edit'} link</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3 mt-3">
              <CInputGroupText>Display name</CInputGroupText>
              <CFormInput
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value)
                  setIsModified(true)
                  validateUrl(url)
                }}
                maxLength={100}
                required
              ></CFormInput>
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText>URL</CInputGroupText>
              <CFormInput
                value={url}
                onChange={(e) => {
                  setURL(e.target.value)
                  setIsModified(true)
                  //   validateUrl(e.target)
                  try {
                    new URL(e.target.value) // If valid, no error is thrown
                    setIsValid(true)
                  } catch {
                    setIsValid(false)
                  }
                }}
                feedbackInvalid="Please insert a valid link."
                valid={isValid}
                invalid={isModified && !isValid}
                maxLength={1000}
                required
              ></CFormInput>
            </CInputGroup>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                refreshFields()
                onClose()
              }}
            >
              Annulla
            </CButton>
            <CButton color="primary" type="submit" disabled={!isModified || !isValid}>
              Continua
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default LinkModal
