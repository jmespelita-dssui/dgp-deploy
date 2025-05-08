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

import moment from 'moment-timezone'

import { useToast } from 'src/context/ToastContext'

import React, { useState } from 'react'
import { initializeAxiosInstance } from 'src/util/axiosUtils'
import {
  getSystemUserID,
  assignUserToPratica,
  getFields,
  checkIfExistingProt,
} from 'src/util/taskUtils'
import { useNavigate } from 'react-router-dom'

import FieldsCreate from './FieldsCreate'
import ProtocolledSelect from './ProtocolledSelect'
import NonProtocolledSelect from './NonProtocolledSelect'
import { logActivity } from 'src/util/activityLogUtils'

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
    let exists = await checkIfExistingProt(pratica.cr9b3_protno)

    // console.log('input', pratica)
    try {
      // console.log(pratica.cr9b3_protno, checkIfExisting(pratica.cr9b3_protno))
      if (!exists) {
        const praticaDetailsResponse = await addNewPratica(pratica)
        console.log('output pratica id', praticaDetailsResponse)
        if (praticaDetailsResponse) {
          // assign user to task
          superioriInvitati.map(async (id) => {
            console.log('adding superior:', id)
            const superiorID = await getSystemUserID(id)
            assignUserToPratica(
              superiorID,
              praticaDetailsResponse.data.cr9b3_praticaid,
              'cr9b3_pratica_superiore',
            )
          })

          responsabili.map(async (id) => {
            const respID = await getSystemUserID(id)
            if (
              !assignUserToPratica(
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
          const axiosInstance = await initializeAxiosInstance()
          const modifiedByPromise = await axiosInstance.get(
            `systemusers(${praticaDetailsResponse.data._modifiedby_value})`,
          )

          let finalLogEntry = [
            {
              user: modifiedByPromise.data.fullname,
              actionType: 'created pratica.',
              actions: null,
              timestamp: moment().tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss'),
            },
          ]
          logActivity(praticaDetailsResponse.data.cr9b3_praticaid, finalLogEntry)

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

  const addNewPratica = async (pratica) => {
    const axiosInstance = await initializeAxiosInstance()
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
                <CCol md={6}>
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
