import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CHeader,
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormCheck,
  CButton,
} from '@coreui/react-pro'
import React, { useState, useEffect } from 'react'
import CreateRichiestaContributo from './protocollato/CreateRichiestaContributo'
import CreateProgettoEsterno from './protocollato/CreateProgettoEsterno'
import CreateEvento from './protocollato/CreateEvento'
import CreateRicezioneRapporti from './protocollato/CreateRicezioneRapporti'
import CreateVisita from './protocollato/CreateVisita'
import ProtocolledSelect from './ProtocolledSelect'
import NonProtocolledSelect from './NonProtocolledSelect'
import CreateSenzaRichiestaEvento from './protocollato/CreateSenzaRichiestaEvento'
import CreateSenzaRichiestaInvioLettera from './protocollato/CreateSenzaRichiestaInvioLettera'
import CreateNPRichiestaContributo from './nonProtocollato/CreateNPRichiestaContributo'
import CreateNPPurtroppo from './nonProtocollato/CreateNPPurtroppo'
import CreateNPGenerici from './nonProtocollato/CreateNPGenerici'

const CreateTask = () => {
  const [isProtocolled, setIsProtocolled] = useState('')
  const [titolo, setTitolo] = useState('')
  const [categoria, setCategoria] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    console.log('HELLO', titolo, categoria)
  }

  const onChangeCategoria = (cat) => {
    setCategoria(cat)
  }

  return (
    <>
      <CCard className="p-4 mb-3">
        <CHeader>
          <h4>Create new pratica</h4>
        </CHeader>
        <CCardBody>
          <CContainer>
            <CForm onSubmit={onSubmit}>
              <CRow className="mb-4">
                <CCol>
                  <CFormInput
                    type="text"
                    size="lg"
                    placeholder="Titolo"
                    aria-label="lg input example"
                    className="mt-4"
                    onChange={(e) => {
                      setTitolo(e.target.value.trim())
                    }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={3}>
                  <CInputGroup>
                    <CInputGroupText id="categoria">Type</CInputGroupText>
                    <CFormSelect
                      aria-label="Default select example"
                      defaultValue={'Choose category'}
                      options={[
                        { label: 'Choose type', value: '0' },
                        { label: 'Protocollato', value: 'si' },
                        { label: 'Non protocollato', value: 'no' },
                      ]}
                      onChange={(e) => {
                        setIsProtocolled(e.target.value)
                        setCategoria('0')
                      }}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={7}>
                  {isProtocolled === 'si' ? (
                    <ProtocolledSelect onChangeCategoria={onChangeCategoria} />
                  ) : isProtocolled === 'no' ? (
                    <NonProtocolledSelect onChangeCategoriaNP={onChangeCategoria} />
                  ) : (
                    ''
                  )}
                </CCol>
              </CRow>
              <CCol md={12}>
                <CButton color="primary" type="submit">
                  Submit form
                </CButton>
              </CCol>
            </CForm>
          </CContainer>
        </CCardBody>
      </CCard>
      {categoria === '1' ? (
        <CCard className="p-4">
          <CreateRichiestaContributo />
        </CCard>
      ) : categoria === '2' ? (
        <CCard className="p-4">
          <CreateProgettoEsterno />
        </CCard>
      ) : categoria === '3' ? (
        <CCard className="p-4">
          <CreateEvento />
        </CCard>
      ) : categoria === '4' ? (
        <CCard className="p-4">
          <CreateRicezioneRapporti />
        </CCard>
      ) : categoria === '5' ? (
        <CCard className="p-4">
          <CreateVisita />
        </CCard>
      ) : categoria === '6' ? (
        <CCard className="p-4">
          <CreateSenzaRichiestaEvento />
        </CCard>
      ) : categoria === '7' ? (
        <CCard className="p-4">
          <CreateSenzaRichiestaInvioLettera />
        </CCard>
      ) : categoria === '8' ? (
        <CCard className="p-4">
          <CreateNPRichiestaContributo />
        </CCard>
      ) : categoria === '9' ? (
        <CCard className="p-4">
          <CreateNPPurtroppo />
        </CCard>
      ) : categoria === '10' ? (
        <CCard className="p-4">
          <CreateNPGenerici />
        </CCard>
      ) : (
        ''
      )}
    </>
  )
}

export default CreateTask

// const [superiors, setSuperiors] = useState([])
// const [responsibles, setResponsibles] = useState([])
// useEffect(() => {
//   const fetchInternalUsers = async () => {
//     const provider = Providers.globalProvider
//     const graphClient = provider.graph.client

//     const sups = await graphClient
//       .api('/groups/317aa3d0-a94a-4c7c-bcb9-8870cfececa4/members')
//       .get()

//     const resps = await graphClient
//       .api('/groups/2e227ba3-c594-4117-b106-d9735ddf4d26/members')
//       .get()

//     setSuperiors(sups.value)
//     setResponsibles(resps.value)
//   }

//   fetchInternalUsers()
// }, [])
