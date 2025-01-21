import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormSelect,
  CHeader,
  CRow,
  CInputGroup,
  CInputGroupText,
  CSpinner,
} from '@coreui/react-pro'

import { useToast } from 'src/context/ToastContext'

import React, { useState } from 'react'
import { getAccessToken, createAxiosInstance } from 'src/util/axiosUtils'
import { getSystemUserID, assignUserToTask, getFields } from 'src/util/taskUtils'
import { useNavigate } from 'react-router-dom'

import FieldsCreate from './FieldsCreate'
import ProtocolledSelect from './ProtocolledSelect'
import NonProtocolledSelect from './NonProtocolledSelect'

const CreateTask = () => {
  const { addToast } = useToast()
  const [isProtocolled, setIsProtocolled] = useState('')
  const [categoria, setCategoria] = useState('0')
  const [fields, setFields] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const createTask = async (pratica, superioriInvitati, responsabili) => {
    setLoading(true)
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: 'smooth', // Smooth scrolling animation
    })

    // console.log('input', pratica)
    try {
      // console.log(pratica.cr9b3_protno, checkIfExisting(pratica.cr9b3_protno))
      if (await checkIfExisting(pratica.cr9b3_protno)) {
        const praticaDetailsResponse = await addNewPratica(pratica)
        console.log('output pratica id', praticaDetailsResponse)
        if (praticaDetailsResponse) {
          // assign user to task
          superioriInvitati.map(async (id) => {
            console.log('adding superior:', id)
            const superiorID = await getSystemUserID(id)
            assignUserToTask(
              superiorID,
              praticaDetailsResponse.data.cr9b3_praticaid,
              'cr9b3_pratica_superiore',
            )
          })

          responsabili.map(async (id) => {
            const respID = await getSystemUserID(id)
            if (
              !assignUserToTask(
                respID,
                praticaDetailsResponse.data.cr9b3_praticaid,
                'cr9b3_pratica_responsabile',
              )
            ) {
              addToast(
                'An error occured while creating the pratica.',
                'Create Pratica',
                'danger',
                3000,
              )
              return
            }
          })
          addToast('Success! The pratica has been added.', 'Create Pratica', 'success', 3000)
          setTimeout(() => {
            navigate('/tasks')
          }, 2000) // 1000 = 1 second
        } else {
          addToast('An error occured while creating the pratica.', 'Create Pratica', 'danger', 3000)
        }

        setLoading(false)
      } else {
        setLoading(false)
        addToast(
          'Pratica with same protocol number already exists',
          'Create Pratica',
          'warning',
          3000,
        )
        console.log('pratica already exists')
      }
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
        addToast('An error occurred while creating the Pratica.', 'Create Pratica', 'danger', 3000)
        console.error('Entity URL not returned in the response headers.')
      }
      return praticaDetailsResponse
    } catch (error) {
      addToast('An error occurred while creating the Pratica.', 'Create Pratica', 'danger', 3000)
      if (error.isAxiosError) {
        console.error('Axios error details adding new pratica:', error.response)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response.data)
      } else {
        console.error('Non-Axios error:', error)
      }
    }
  }

  const onChangeCategoria = (cat) => {
    setCategoria(cat)
    setFields(getFields(Number(cat)))
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
          {loading && (
            <div className="d-flex justify-content-center">
              <CSpinner size="sm" variant="grow" style={{ width: '3rem', height: '3rem' }} />
            </div>
          )}
        </CCardBody>
      </CCard>
      {categoria != '0' && (
        <CCard className="p-4">
          <FieldsCreate onCreate={createTask} fields={fields} categoria={categoria} />
        </CCard>
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
