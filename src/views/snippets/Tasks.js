import React, { useEffect, useState } from 'react'
import { CCardBody, CAvatar, CRow, CCol, CFormCheck } from '@coreui/react-pro'
import { People, Person, Providers } from '@microsoft/mgt-react'

const Tasks = () => {
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)
  const userIds = ['j.espelita@dssui.org', 'a.smerilli@dssui.org', 'a.ekpo@dssui.org']

  // useEffect(() => {
  //   const getToken = async () => {
  //     try {
  //       const provider = Providers.globalProvider

  //       if (provider && provider.state === 2) {
  //         // // 2 means the user is signed in
  //         // const tokenResponse = await provider.getAccessToken()
  //         // console.log('Access Token:', tokenResponse)
  //         // setAccessToken(tokenResponse) // Store the token if needed
  //         provider
  //           .getAccessToken({ scopes: ['user.read'] }) // request token with required scopes
  //           .then((accessToken) => {
  //             // Fetch user details from Microsoft Graph API
  //             fetch('https://graph.microsoft.com/v1.0/me', {
  //               headers: {
  //                 Authorization: `Bearer ${accessToken}`,
  //               },
  //             })
  //               .then((response) => response.json())
  //               .then((data) => {
  //                 const personData = {
  //                   id: data.id,
  //                   name: data.displayName,
  //                   email: data.mail,
  //                   jobTitle: data.jobTitle,
  //                   mobilePhone: data.mobilePhone,
  //                   officeLocation: data.officeLocation,
  //                 }
  //                 setPerson(personData)
  //                 setLoading(false)
  //               })
  //               .catch((error) => {
  //                 console.error('Error fetching user data:', error)
  //                 setError(error)
  //                 setLoading(false)
  //               })
  //           })
  //           .catch((error) => {
  //             console.error('Error acquiring access token:', error)
  //             setError(error)
  //             setLoading(false)
  //           })
  //       } else {
  //         console.log('User is not signed in.')
  //       }
  //     } catch (error) {
  //       console.error('Error acquiring token:', error)
  //     }
  //   }

  //   getToken()
  // }, [])

  return (
    <>
      <h6>TASKS</h6>
      <CCardBody className="p-3">
        <CCol xs={12}>
          <CRow>
            <CCol xs={8}>
              <CFormCheck
                label="Send to richiedente before sundown, while the birds fly on high."
                // disabled
                onChange={() => console.log('hello')}
              />
            </CCol>
            <CCol xs={2}>
              {userIds.map((userId) => (
                <Person
                  className="m-1"
                  key={userId}
                  userId={userId}
                  showPresence
                  personCardInteraction="hover"
                />
              ))}
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
          </CRow>
        </CCol>
        {/* task  2*/}
        <CCol xs={12}>
          <CRow>
            <CCol xs={8}>
              <CFormCheck label="Draft letter to recipient" onChange={() => console.log('hello')} />
            </CCol>
            <CCol xs={2}>
              <Person
                className="m-1"
                userId="m.czerny@dssui.org"
                showPresence
                personCardInteraction="hover"
              />
            </CCol>
          </CRow>
        </CCol>
      </CCardBody>
    </>
  )
}

export default Tasks
