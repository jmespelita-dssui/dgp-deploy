import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CHeader,
  CRow,
  CInputGroup,
  CInputGroupText,
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
import { getAccessToken, createAxiosInstance } from 'src/util/axiosUtils'

const CreateTask = () => {
  const [isProtocolled, setIsProtocolled] = useState('')
  const [categoria, setCategoria] = useState('')

  const createTask = async (pratica, superioriInvitati) => {
    console.log('input', pratica)
    const praticaDetailsResponse = await addNewPratica(pratica)
    console.log('output pratica id', praticaDetailsResponse.data.cr9b3_praticaid)

    // console.log('Details of the newly created pratica:', data)
    superioriInvitati.map(async (id) => {
      const superiorID = await getSystemUserID(id)
      assignSuperiorToTask(superiorID, praticaDetailsResponse.data.cr9b3_praticaid)
    })
  }

  const addNewPratica = async (pratica) => {
    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)
    let response
    let praticaDetailsResponse
    let entityUrl
    try {
      console.log('adding new pratica', pratica)
      response = await axiosInstance.post('cr9b3_praticas', pratica)
      // Get the OData-EntityId from the response headers
      entityUrl = response.headers['odata-entityid']

      if (entityUrl) {
        console.log(`Pratica created! Entity URL: ${entityUrl}`)

        // Retrieve the details of the created record
        praticaDetailsResponse = await axiosInstance.get(entityUrl)
      } else {
        console.error('Entity URL not returned in the response headers.')
      }
      return praticaDetailsResponse
    } catch (error) {
      if (error.isAxiosError) {
        console.error('Axios error details adding new pratica:', error.response)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response.data)
      } else {
        console.error('Non-Axios error:', error)
      }
    }
  }

  const getSystemUserID = async (user) => {
    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)
    let userID
    try {
      console.log('getting user id', user.id)
      const response = await axiosInstance.get(
        `systemusers?$filter=azureactivedirectoryobjectid eq '${user.id}'`,
      )
      console.log(
        'user id',
        response.data.value[0],
        response.data.value[0].yomifullname,
        response.data.value[0].systemuserid,
      )
      userID = response.data.value[0].systemuserid
    } catch (error) {
      if (error.isAxiosError) {
        console.error('Axios error getting superior ID:', error.response)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response.data)
      } else {
        console.error('Non-Axios error:', error)
      }
    }
    return userID
  }

  const assignSuperiorToTask = async (superiorID, praticaID) => {
    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)
    console.log('adding superiori invitati', superiorID)
    const data = {
      '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${praticaID})`,
    }
    try {
      // POST request to create a relationship in cr9b3_pratica_superiore
      const response = await axiosInstance.post(
        `systemusers(${superiorID})/cr9b3_pratica_superiore/$ref`,
        data,
      )
      console.log('Successfully created the cr9b3_pratica_superiore record:', response.data)
    } catch (error) {
      console.error(
        'Error creating cr9b3_pratica_superiore record:',
        error.response ? error.response.data : error.message,
      )
    }
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
            <CForm>
              <CRow className="mb-3 mt-3">
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
            </CForm>
          </CContainer>
        </CCardBody>
      </CCard>

      {/* Form is shown according to chosen category */}
      {categoria === '129580000' ? (
        <CCard className="p-4">
          <CreateRichiestaContributo />
        </CCard>
      ) : categoria === '129580001' ? (
        <CCard className="p-4">
          <CreateProgettoEsterno />
        </CCard>
      ) : categoria === '129580002' ? (
        <CCard className="p-4">
          <CreateEvento onCreate={createTask} categoria={categoria} />
        </CCard>
      ) : categoria === '129580003' ? (
        <CCard className="p-4">
          <CreateRicezioneRapporti />
        </CCard>
      ) : categoria === '129580004' ? (
        <CCard className="p-4">
          <CreateVisita />
        </CCard>
      ) : categoria === '129580005' ? (
        <CCard className="p-4">
          <CreateSenzaRichiestaEvento />
        </CCard>
      ) : categoria === '129580006' ? (
        <CCard className="p-4">
          <CreateSenzaRichiestaInvioLettera />
        </CCard>
      ) : categoria === '129580010' ? (
        <CCard className="p-4">
          <CreateNPRichiestaContributo />
        </CCard>
      ) : categoria === '129580007' ? (
        <CCard className="p-4">
          <CreateNPPurtroppo />
        </CCard>
      ) : categoria === '129580008' ? (
        <CCard className="p-4">
          <CreateNPGenerici />
        </CCard>
      ) : categoria === '129580000' ? (
        <CCard className="p-4">
          {/* <CreateNPGenerici /> */}
          Messaggi Pontifici
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
