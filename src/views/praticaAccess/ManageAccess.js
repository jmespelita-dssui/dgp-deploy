/* eslint-disable react/prop-types */
import { cilPeople, cilPlus, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CCollapse,
  CContainer,
  CListGroup,
  CListGroupItem,
  CRow,
  CSpinner,
} from '@coreui/react-pro'
import { People, PeoplePicker, Person, Get } from '@microsoft/mgt-react'
import React, { useEffect, useState } from 'react'
import { useToast } from 'src/context/ToastContext'
import {
  getUniqueListById,
  getUserGraphDetails,
  giveAccess,
  removeAccess,
} from 'src/services/accessService'
import { getSystemUserID, getUser } from 'src/services/userService'
import apiClient from 'src/util/apiClient'

const ManageAccess = ({ officialiIncaricati, pratica, refresh }) => {
  const [visibleDefault, setVisibleDefault] = useState(false)
  const [defaultAccess, setDefaultAccess] = useState([])
  const [others, setOthers] = useState([])
  const [newOthers, setNewOthers] = useState([])
  const { addToast } = useToast()
  const [creator, setCreator] = useState()
  const [loading, setLoading] = useState(false)
  const [defaultLoading, setDefaultLoading] = useState(false)
  const [othersLoading, setOthersLoading] = useState(false)

  useEffect(() => {
    if (pratica) {
      getDefaultAccessList()
      getNormalAccessList()
    }
  }, [pratica, refresh])

  const getDefaultAccessList = async () => {
    try {
      if (pratica.cr9b3_prano !== '') {
        setDefaultLoading(true)
        const creatorUserDetails = await getUser(pratica._createdby_value)
        const creatorGraphDetails = await getUserGraphDetails(
          creatorUserDetails.azureactivedirectoryobjectid,
        )
        setCreator(creatorGraphDetails)
        const defaultAccessList = [...(officialiIncaricati || []), creatorGraphDetails]

        setDefaultAccess(defaultAccessList)
        setDefaultLoading(false)
      }
    } catch (error) {
      console.error('Error fetching default access:', error)
      setDefaultLoading(false)
    }
  }

  const getNormalAccessList = async () => {
    try {
      if (pratica.cr9b3_prano !== '') {
        setOthersLoading(true)

        const response = await apiClient.get(
          `cr9b3_praticas?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}'&$expand=cr9b3_access`,
        )
        let usersWithAccess = response.data.value[0].cr9b3_access

        const userDetailsPromises = usersWithAccess.map(async (user) => {
          return await getUserGraphDetails(user.azureactivedirectoryobjectid)
        })

        const usersWithAccessDetails = await Promise.all(userDetailsPromises)
        setOthers(usersWithAccessDetails)
        setOthersLoading(false)
      }
    } catch (error) {
      console.error('Error fetching normal access:', error)
      setOthersLoading(false)
    }
  }

  const addOthers = async () => {
    const filteredNewOthersList = getNotInDefault(newOthers)
    const newList = [...(others || []), ...filteredNewOthersList]

    try {
      let systemUserIDs = await Promise.all(
        filteredNewOthersList.map(async (person) => {
          console.log('person to add', person)
          return getSystemUserID(person)
        }),
      )
      systemUserIDs.map(async (id) => {
        giveAccess(id, pratica.cr9b3_praticaid)
      })
      setOthers(getUniqueListById(newList))
    } catch (error) {
      console.error(error)
      addToast(`Errore durante l'aggiunta dell'accesso`, 'Modifica accesso', 'warning', 3000)
    }
    setNewOthers([])
  }

  const getNotInDefault = (arr) => {
    const notInDefault = []
    const inDefault = []

    arr.forEach((item2) => {
      const exists = defaultAccess.some((item1) => {
        const match = item1.id === item2.id
        return match
      })

      if (!exists) {
        notInDefault.push(item2)
      } else {
        inDefault.push(item2)
      }
    })

    const inDefaultNames = inDefault.map((item) => item.displayName).join(', ')
    if (inDefault.length > 0) {
      addToast(`Accesso già esistente: ${inDefaultNames}`, 'Modifica pratica', 'success', 3000)
    }

    return notInDefault
  }

  const removeItem = async (user) => {
    const systemuserid = await getSystemUserID(user)
    // console.log(systemuserid)
    setLoading(true)
    try {
      removeAccess(pratica.cr9b3_praticaid, systemuserid)

      setOthers(others.filter((item) => item.id !== user.id))
      setLoading(false)
    } catch (error) {
      addToast("Errore durante la rimozione dell'accesso.", 'Modifica accesso', 'warning', 3000)
      setLoading(false)
      if (error.isAxiosError) {
        console.error('Axios error details adding new pratica:', error.response)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response.data)
      } else {
        console.error('Non-Axios error:', error)
      }
    }
  }

  return (
    <>
      <CContainer>
        <h6>SHARED TO</h6>
        <CListGroup flush>
          <CListGroupItem
            className="link-controls"
            onClick={() => setVisibleDefault(!visibleDefault)}
          >
            <CRow>
              {defaultLoading && (
                <CCol md={1}>
                  <CSpinner variant="grow" size="sm" color="primary" />
                </CCol>
              )}
              <CCol>Default</CCol>
            </CRow>
          </CListGroupItem>
          <CListGroup className="m-3" flush>
            <small className="text-body-secondary">
              Tutte le pratiche sono visibili a tutti i superiori e ai responsabili di sezione.
            </small>
            <CListGroupItem className="mb-2">
              Officiali Incaricati
              {officialiIncaricati &&
                officialiIncaricati.map((s) => (
                  <Person key={s.id} className="m-3" personQuery={s.mail} view="twoLines" />
                ))}
            </CListGroupItem>
            {creator && (
              <CListGroupItem className="mb-2">
                Creatore pratica
                <Person className="m-3" personQuery={creator.mail} view="twoLines" />
              </CListGroupItem>
            )}
          </CListGroup>

          <CListGroupItem>
            <CRow>
              {othersLoading && (
                <CCol md={1}>
                  <CSpinner variant="grow" size="sm" color="primary" />
                </CCol>
              )}
              <CCol>Altri</CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={9}>
                <PeoplePicker
                  className="mt-2"
                  groupId="7430b06a-2d45-4576-b6d9-dd969da4d43b"
                  // selectedPeople={officilaliIncaricatiList}
                  selectedPeople={newOthers}
                  selectionChanged={(e) => {
                    setNewOthers(e.target.selectedPeople)
                  }}
                />
              </CCol>
              <CCol md={3}>
                <CButton
                  color="light"
                  className="mt-2"
                  onClick={() => addOthers()}
                  disabled={newOthers.length === 0}
                >
                  <CIcon icon={cilPlus} className="text-body-secondary icon-link" />
                  {/* Add correspondence */}
                </CButton>
              </CCol>
            </CRow>
            {others &&
              others.map((s) => (
                <CRow key={s.id}>
                  <CCol>
                    <Person className="m-2" personQuery={s.mail} view="oneline" />
                  </CCol>
                  <CCol className="m-2 link-controls">
                    {loading ? (
                      <CSpinner variant="grow" size="sm" color="primary" />
                    ) : (
                      <CIcon icon={cilX} onClick={() => removeItem(s)} />
                    )}
                  </CCol>
                </CRow>
              ))}
          </CListGroupItem>
        </CListGroup>
      </CContainer>
    </>
  )
}

export default ManageAccess
