/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react-pro'
import { getUser } from 'src/util/accessUtils'

const RequestAccess = ({ visible, onClose, onSubmit, pratica }) => {
  const [user, setUser] = useState()
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const createdBy = await getUser(pratica._createdby_value)
    setUser(createdBy)
  }
  return (
    <CModal visible={visible} alignment="center" backdrop="static">
      <CModalHeader closeButton={false}>
        <CModalTitle>Richiedi accesso</CModalTitle>
      </CModalHeader>
      <CModalBody className="m-3">
        {user ? (
          <p>
            Non hai accesso alla pratica <strong>{pratica.cr9b3_protno}</strong>. Vuoi inviare una
            richiesta di accesso a {user.fullname}?
          </p>
        ) : (
          ''
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Annulla
        </CButton>
        <CButton color="primary" onClick={onSubmit}>
          Continua
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default RequestAccess
