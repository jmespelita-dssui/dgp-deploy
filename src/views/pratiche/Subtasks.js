import React, { useState } from 'react'
import { CCardBody, CRow, CCol, CFormCheck } from '@coreui/react-pro'
import { Person } from '@microsoft/mgt-react'
import ConfirmationModal from '../modals/ConfirmationModal'

const Tasks = (tasks) => {
  const [visibleConfirmation, setVisibleConfirmation] = useState(false)

  const onCloseConfirmation = () => {
    setVisibleConfirmation(false)
  }

  return (
    <>
      <ConfirmationModal
        visible={visibleConfirmation}
        onClose={onCloseConfirmation}
        onSubmit={onCloseConfirmation}
        // popupMsg={popupMsg}
      />
      <h6>TASKS</h6>
      <CCardBody className="p-3">
        {!tasks ? (
          <>
            <CRow className="pb-2">
              <CCol xs={7} style={{ fontWeight: 'bold' }}>
                Description
              </CCol>
              <CCol xs={2}></CCol>
              <CCol xs={3} style={{ fontWeight: 'bold' }}>
                Deadline
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={7}>
                <CFormCheck label="Send to richiedente before sundown, while the birds fly on high." />
              </CCol>
              <CCol xs={2}>
                {/* {userIds.map((userId) => (
                <Person
                  className="m-1"
                  key={userId}
                  userId={userId}
                  showPresence
                  personCardInteraction="hover"
                />
              ))} */}
                <Person
                  className="m-1"
                  userId="p.debbane@dssui.org"
                  showPresence
                  personCardInteraction="hover"
                />
                {/* {userIds.map((userId) => (
                <Person
                  className="m-1"
                  key={userId} // Unique key for each user
                  // userId={userId} // Query each user by their specific ID
                  personQuery={userId}
                  showPresence={true} // Show presence status
                  personCardInteraction="hover" // Show more details on click
                />
              ))} */}
              </CCol>
              <CCol xs={3}>21/12/2024</CCol>
            </CRow>
            <CRow>
              <CCol xs={7}>
                <CFormCheck label="Draft letter to recipient" />
              </CCol>
              <CCol xs={2}>
                <Person
                  className="m-1"
                  userId="a.piccirilli@dssui.org"
                  showPresence
                  personCardInteraction="hover"
                />
              </CCol>
              <CCol xs={3}>22/12/2024</CCol>
            </CRow>
          </>
        ) : (
          <>No tasks assigned.</>
        )}
      </CCardBody>
    </>
  )
}

export default Tasks
