/* eslint-disable react/prop-types */
import { React, useEffect, useState } from 'react'
import {
  CCol,
  CContainer,
  CForm,
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react-pro'

import ProtocolledSelect from './ProtocolledSelect'
import NonProtocolledSelect from './NonProtocolledSelect'

const ChooseCategory = ({ cat, visible, onCancel, onSave }) => {
  const [isProtocolled, setIsProtocolled] = useState('')
  const [categoria, setCategoria] = useState(cat)
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    setIsProtocolled(Number(cat) <= 129580006 ? 'si' : 'no')
  }, [cat])

  const onChangeCategoria = (choice) => {
    choice > 0 ? setIsSelected(true) : setIsSelected(false)
    console.log('category:', choice)
    setCategoria(choice)
  }

  const resetForm = () => {
    setCategoria(cat)
    onCancel()
  }

  const onSubmit = (e) => {
    e.preventDefault()
    onSave(Number(categoria))
  }

  return (
    <CModal backdrop="static" visible={visible} size="lg" alignment="center">
      <CModalHeader closeButton={false}>
        <CModalTitle>Change category</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CContainer>
          <CForm onSubmit={onSubmit}>
            <CRow className="mb-3 mt-3">
              <CCol md={6}>
                <CInputGroup>
                  <CInputGroupText id="cat">Type</CInputGroupText>
                  <CFormSelect
                    aria-label="Default select example"
                    defaultValue={isProtocolled}
                    options={[
                      { label: 'Choose type', value: '0' },
                      { label: 'Protocollato', value: 'si' },
                      { label: 'Non protocollato', value: 'no' },
                    ]}
                    onChange={(e) => {
                      setIsProtocolled(e.target.value)
                      //   setCategoria('0')
                    }}
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                {isProtocolled === 'si' ? (
                  <ProtocolledSelect
                    cat={cat}
                    onChangeCategoria={onChangeCategoria}
                    isEdit={true}
                  />
                ) : isProtocolled === 'no' ? (
                  <NonProtocolledSelect
                    onChangeCategoriaNP={onChangeCategoria}
                    cat={cat}
                    isEdit={true}
                  />
                ) : (
                  ''
                )}
              </CCol>
            </CRow>
            <CModalFooter>
              <CButton color="secondary" onClick={resetForm}>
                Back
              </CButton>
              <CButton color="primary" type="submit" disabled={!isSelected}>
                Save
              </CButton>
            </CModalFooter>
          </CForm>
        </CContainer>
      </CModalBody>
    </CModal>
  )
}

export default ChooseCategory
