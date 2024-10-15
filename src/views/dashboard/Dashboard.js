import React, { useState, useEffect } from 'react'

import { CCard, CCardBody } from '@coreui/react-pro'

import { Providers } from '@microsoft/mgt-element'
import { FileList, Agenda, PeoplePicker, People } from '@microsoft/mgt-react'

const Dashboard = () => {
  const [accessToken, setAccessToken] = useState([])
  const [people, setPeople] = useState([])

  const handlePeopleSelect = (e) => {
    console.log(e.target.selectedPeople)
    setPeople(e.target.selectedPeople)
  }

  useEffect(() => {
    const getToken = async () => {
      try {
        const provider = Providers.globalProvider

        if (provider && provider.state === 2) {
          // 2 means the user is signed in
          const tokenResponse = await provider.getAccessToken()
          console.log('Access Token:', tokenResponse)
          setAccessToken(tokenResponse) // Store the token if needed
        } else {
          console.log('User is not signed in.')
        }
      } catch (error) {
        console.error('Error acquiring token:', error)
      }
    }

    getToken()
  }, [])
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          Selected people: <People people={people} />
          <PeoplePicker selectionChanged={handlePeopleSelect} userType="user" />
        </CCardBody>
        <CCardBody>
          {/* <CButton onClick={getRecords}>Get records</CButton> */}
          {/* <Agenda /> */}
          <FileList />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
