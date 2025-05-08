/* eslint-disable react/prop-types */
import { CCollapse, CContainer, CListGroup, CListGroupItem } from '@coreui/react-pro'
import { People, Person } from '@microsoft/mgt-react'
import React, { useEffect, useState } from 'react'
import { getGroupMemberCount } from 'src/util/taskUtils'

const ManageAccess = ({ responsabile, officialiIncaricati }) => {
  const [visibleDefault, setVisibleDefault] = useState(false)
  const [count, setCount] = useState(0)
  useEffect(() => {
    getCount()
  }, [responsabile, officialiIncaricati])

  const getCount = async () => {
    const superiorCount = await getGroupMemberCount('317aa3d0-a94a-4c7c-bcb9-8870cfececa4')
    const secretariatCount = await getGroupMemberCount('f67d3e5d-02c7-4d4d-8b95-834533623ad6')
    const responsabileCount = responsabile.length
    const officialiIncaricatiCount = officialiIncaricati.length
    setCount(superiorCount + secretariatCount + responsabileCount + officialiIncaricatiCount)
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
                    <Person
                      key={s.id}
                      className="m-3"
                      personQuery={s.mail}
                      personCardInteraction="hover"
                      showPresence={false}
                      view="twoLines"
                    />
                  ))}
              </CListGroupItem>
              <CListGroupItem className="mb-2">
                Assigned Official
                {officialiIncaricati &&
                  officialiIncaricati.map((s) => (
                    <Person
                      key={s.id}
                      className="m-3"
                      personQuery={s.mail}
                      personCardInteraction="hover"
                      showPresence={false}
                      view="twoLines"
                    />
                  ))}
              </CListGroupItem>
            </CListGroup>
          </CCollapse>

          <CListGroupItem>Others</CListGroupItem>
        </CListGroup>
      </CContainer>
    </>
  )
}

export default ManageAccess
