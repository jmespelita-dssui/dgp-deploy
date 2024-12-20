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
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CSpinner,
} from '@coreui/react-pro'
import React, { useState, useEffect, useRef } from 'react'
import { getAccessToken, createAxiosInstance } from 'src/util/axiosUtils'
import {
  getSystemUserID,
  // successCreateTaskToast,
  // duplicateCreateTaskToast,
  errorToast,
} from 'src/util/taskUtils'
import { useNavigate } from 'react-router-dom'

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
  const [categoria, setCategoria] = useState('')
  const [loading, setLoading] = useState(false)

  const [toast, addToast] = useState(0)
  const toaster = useRef()

  const navigate = useNavigate()

  const createTask = async (pratica, superioriInvitati, responsabili) => {
    setLoading(true)
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: 'smooth', // Smooth scrolling animation
    })

    console.log('input', pratica)
    // console.log(pratica.cr9b3_protno, checkIfExisting(pratica.cr9b3_protno))
    if (await checkIfExisting(pratica.cr9b3_protno)) {
      const praticaDetailsResponse = await addNewPratica(pratica)
      console.log('output pratica id', praticaDetailsResponse.data.cr9b3_praticaid)

      // assign user to task
      superioriInvitati.map(async (id) => {
        const superiorID = await getSystemUserID(id)
        assignUserToTask(
          superiorID,
          praticaDetailsResponse.data.cr9b3_praticaid,
          'cr9b3_pratica_superiore',
        )
      })

      responsabili.map(async (id) => {
        const respID = await getSystemUserID(id)
        assignUserToTask(
          respID,
          praticaDetailsResponse.data.cr9b3_praticaid,
          'cr9b3_pratica_responsabile',
        )
      })

      setLoading(false)
      addToast(successCreateTaskToast)
      setTimeout(() => {
        navigate('/tasks')
      }, 3500) // 1000 = 1 second
    } else {
      setLoading(false)
      addToast(duplicateCreateTaskToast)
      console.log('pratica already exists')
    }
  }

  //check if pratica with prot
  const checkIfExisting = async (protNo) => {
    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)
    const response = await axiosInstance.get(`cr9b3_praticas?$filter=cr9b3_protno eq '${protNo}'`)
    console.log('does it exist???', response.data.value)
    return response.data.value && response.data.value.length === 0
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
        addToast(errorToast)
        console.error('Entity URL not returned in the response headers.')
      }
      return praticaDetailsResponse
    } catch (error) {
      addToast(errorToast)
      if (error.isAxiosError) {
        console.error('Axios error details adding new pratica:', error.response)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response.data)
      } else {
        console.error('Non-Axios error:', error)
      }
    }
  }

  const assignUserToTask = async (userID, praticaID, table) => {
    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)
    console.log('adding superiori invitati', userID)
    const data = {
      '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${praticaID})`,
    }
    try {
      // POST request to create a relationship in cr9b3_pratica_superiore
      const response = await axiosInstance.post(
        `systemusers(${userID})/${table}/$ref`, //cr9b3_pratica_superiore
        data,
      )
      console.log('Successfully created the user <-> pratica record:', response.data)
    } catch (error) {
      addToast(errorToast)
      console.error(
        'Error creating user <-> pratica record:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  const onChangeCategoria = (cat) => {
    setCategoria(cat)
  }

  const successCreateTaskToast = (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#198754"></rect>
        </svg>
        <div className="fw-bold me-auto">Create Pratica</div>
        {/* <small>7 min ago</small> */}
      </CToastHeader>
      <CToastBody>Success! The pratica has been added.</CToastBody>
    </CToast>
  )

  const errorToast = (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#8f3937"></rect>
        </svg>
        <div className="fw-bold me-auto">Create Pratica</div>
        {/* <small>7 min ago</small> */}
      </CToastHeader>
      <CToastBody>An error occurred while creating the Pratica.</CToastBody>
    </CToast>
  )

  const duplicateCreateTaskToast = (
    <CToast>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#8f3937"></rect>
        </svg>
        <div className="fw-bold me-auto">Create Pratica</div>
      </CToastHeader>
      <CToastBody>Pratica with same protocol number already exists</CToastBody>
    </CToast>
  )

  return (
    <>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
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
          {loading && (
            <div className="d-flex justify-content-center">
              <CSpinner size="sm" variant="grow" style={{ width: '3rem', height: '3rem' }} />
            </div>
          )}
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
