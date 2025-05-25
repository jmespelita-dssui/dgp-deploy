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
} from '@coreui/react-pro'
import { People, PeoplePicker, Person } from '@microsoft/mgt-react'
import React, { useEffect, useState } from 'react'
import {
  getGroupMemberCount,
  getGroupMembers,
  getSystemUserID,
  getUser,
  getUserGraphDetails,
} from 'src/util/taskUtils'
import { useToast } from 'src/context/ToastContext'

const ManageAccess = ({ responsabile, officialiIncaricati, pratica }) => {
  const [visibleDefault, setVisibleDefault] = useState(false)
  const [count, setCount] = useState(0)
  const [defaultAccess, setDefaultAccess] = useState([])
  const [others, setOthers] = useState([])
  const [newOthers, setNewOthers] = useState([])
  const { addToast } = useToast()
  const [creator, setCreator] = useState()

  useEffect(() => {
    if (pratica) {
      getDefaultAccess()
    }
  }, [responsabile, officialiIncaricati])

  const getDefaultAccess = async () => {
    const superiors = await getGroupMembers('317aa3d0-a94a-4c7c-bcb9-8870cfececa4')
    const secretariat = await getGroupMembers('f67d3e5d-02c7-4d4d-8b95-834533623ad6')
    const creatorUserDetails = await getUser(pratica._createdby_value)
    const creatorGraphDetails = await getUserGraphDetails(
      creatorUserDetails.azureactivedirectoryobjectid,
    )
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
  }

  const addOthers = () => {
    const newList = [...(others || []), ...newOthers]
    const filteredList = getNotInDefault(newList)
    setOthers(uniqueById(filteredList))
    setNewOthers([])
  }

  //remove duplicates in others list and remove empty arrays
  const uniqueById = (arr) => {
    console.log('unique by id', arr)
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
        if (match) {
          console.log('hello') // Element exists in defaultAccess
        }
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

  const removeItem = (id) => {
    setOthers(others.filter((item) => item.id !== id))
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
            Default ({count})
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
            Others
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
                <CButton color="light" className="mt-2" onClick={() => addOthers()}>
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
                    <CIcon icon={cilX} onClick={() => removeItem(s.id)} />
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
