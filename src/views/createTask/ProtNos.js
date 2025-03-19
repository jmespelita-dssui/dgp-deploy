/* eslint-disable react/prop-types */
import { CRow, CCol, CFormInput, CButton } from '@coreui/react-pro'
import React, { useEffect, useState } from 'react'
import { cilPlus, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ProtNos = ({ triggerUpdateProtNos, values, isView }) => {
  const [protNoValues, setProtNoValues] = useState([])

  useEffect(() => {
    if (values) {
      setProtNoValues(values.filter((item) => item !== ''))
    }
  }, [values])

  // Handle input changes
  const handleInputChange = (index, value) => {
    const updatedValues = [...protNoValues]
    updatedValues[index] = value
    setProtNoValues(updatedValues)
    triggerUpdateProtNos(updatedValues)
  }

  // Add new input field
  const addProtNo = () => {
    setProtNoValues((prev) => [...prev, ''])
  }

  // Remove specific input field
  const removeProtNo = (indexToRemove) => {
    const updatedValues = protNoValues.filter((_, index) => index !== indexToRemove)
    setProtNoValues(updatedValues)
    triggerUpdateProtNos(updatedValues)
  }

  return (
    <>
      {protNoValues ? (
        isView ? (
          <ul>
            {protNoValues.map((item, index) => (
              <li key={index}>{item} </li>
            ))}
          </ul>
        ) : (
          protNoValues.map((value, index) => (
            <CRow key={index} className="mb-3">
              <CCol md={6}>
                <CFormInput
                  id={`protno-${index}`}
                  placeholder="Additional prot. no."
                  maxLength={5}
                  value={value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  required
                />
              </CCol>
              <CCol>
                <CButton color="link" onClick={() => removeProtNo(index)}>
                  <CIcon icon={cilX} className="me-md-2" />
                  Remove
                </CButton>
              </CCol>
            </CRow>
          ))
        )
      ) : (
        'ok'
      )}

      {!isView ? (
        <CRow className="mb-5">
          <CCol md={6}>
            <CButton color="link" onClick={addProtNo}>
              <CIcon icon={cilPlus} className="me-md-2" />
              Add prot. no
            </CButton>
          </CCol>
        </CRow>
      ) : (
        ''
      )}
    </>
  )
}

export default ProtNos
