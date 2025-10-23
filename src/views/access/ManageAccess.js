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
import {
  getGroupMembers,
  getSystemUserID,
  getUser,
  getUserGraphDetails,
  giveAccess,
} from 'src/util/taskUtils'
import { useToast } from 'src/context/ToastContext'
import { initializeAxiosInstance } from 'src/util/axiosUtils'
import _access from 'src/_access'
import LoadingOverlay from '../modals/LoadingOverlay'

const ManageAccess = ({ responsabile, officialiIncaricati, pratica }) => {
  const [visibleDefault, setVisibleDefault] = useState(false)
  const [count, setCount] = useState(0)
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
      getDefaultAccess()
      getNormalAccess()
    }
  }, [pratica])

  const getDefaultAccess = async () => {
    try {
      if (pratica.cr9b3_prano !== '') {
        setDefaultLoading(true)
        const superiors = _access.superiors
        const secretariat = _access.secretariat
        const creatorUserDetails = await getUser(pratica._createdby_value)
        const creatorGraphDetails = await getUserGraphDetails(
          creatorUserDetails.azureactivedirectoryobjectid,
        )
        // console.log('creator graph details', creatorGraphDetails)
        setCreator(creatorGraphDetails)
        const defaultAccessList = [
          ...(superiors || []),
          ...(secretariat || []),
          ...(responsabile || []),
          ...(officialiIncaricati || []),
          creatorGraphDetails,
        ]

        setDefaultAccess(defaultAccessList)
        setCount(uniqueById(defaultAccessList).length)
        setDefaultLoading(false)
      }
    } catch (error) {
      console.error('Error fetching default access:', error)
      setDefaultLoading(false)
    }
  }

  const getNormalAccess = async () => {
    try {
      if (pratica.cr9b3_prano !== '') {
        setOthersLoading(true)
        const axiosInstance = await initializeAxiosInstance()
        const response = await axiosInstance.get(
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
          return getSystemUserID(person)
        }),
      )
      systemUserIDs.map(async (id) => {
        giveAccess(id, pratica.cr9b3_praticaid)
      })
      setOthers(uniqueById(newList))
    } catch (error) {
      console.error(error)
      addToast(`Error adding access`, 'Edit Pratica', 'warning', 3000)
    }
    setNewOthers([])
  }

  //remove duplicates in others list and remove empty arrays
  const uniqueById = (arr) => {
    // console.log('unique by id', arr)
    const seen = new Set()
    return arr
      .filter((item) => (Array.isArray(item) ? item.length > 0 : true)) // remove empty arrays
      .filter((item) => {
        const obj = Array.isArray(item) ? item[0] : item // support nested arrays
        if (!obj || !obj.id) return false
        if (seen.has(obj.id)) return false
        seen.add(obj.id)
        return true
      })
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
      addToast(`Existing access: ${inDefaultNames}`, 'Edit Pratica', 'success', 3000)
    }

    return notInDefault
  }

  const removeItem = async (user) => {
    const axiosInstance = await initializeAxiosInstance()
    const systemuserid = await getSystemUserID(user)
    // console.log(systemuserid)
    setLoading(true)
    try {
      const response = await axiosInstance.delete(
        `cr9b3_praticas(${pratica.cr9b3_praticaid})/cr9b3_access(${systemuserid})/$ref`,
      )
      setOthers(others.filter((item) => item.id !== user.id))
      setLoading(false)
    } catch (error) {
      addToast('Error occurred while removing access.', 'Edit Pratica', 'warning', 3000)
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
              <CCol>Default ({count})</CCol>
            </CRow>
          </CListGroupItem>
          <CCollapse visible={visibleDefault}>
            <CListGroup className="m-3" flush>
              <CListGroupItem className="mb-2">
                Superiors
                <People
                  groupId="317aa3d0-a94a-4c7c-bcb9-8870cfececa4"
                  showMax={20}
                  className="m-2"
                />
              </CListGroupItem>
              <CListGroupItem className="mb-2">
                Secretariat{' '}
                <People
                  groupId="f67d3e5d-02c7-4d4d-8b95-834533623ad6"
                  showMax={20}
                  className="m-2"
                />
              </CListGroupItem>
              <CListGroupItem className="mb-2">
                Section Responsible
                {responsabile &&
                  responsabile.map((s) => (
                    <Person key={s.id} className="m-3" personQuery={s.mail} view="twoLines" />
                  ))}
              </CListGroupItem>
              <CListGroupItem className="mb-2">
                Assigned Official
                {officialiIncaricati &&
                  officialiIncaricati.map((s) => (
                    <Person key={s.id} className="m-3" personQuery={s.mail} view="twoLines" />
                  ))}
              </CListGroupItem>
              {creator && (
                <CListGroupItem className="mb-2">
                  Pratica Creator
                  <Person className="m-3" personQuery={creator.mail} view="twoLines" />
                </CListGroupItem>
              )}
            </CListGroup>
          </CCollapse>

          <CListGroupItem>
            <CRow>
              {othersLoading && (
                <CCol md={1}>
                  <CSpinner variant="grow" size="sm" color="primary" />
                </CCol>
              )}
              <CCol>Others</CCol>
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
