/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'

import { getAccessToken, createAxiosInstance, getAccessTokenForGraph } from 'src/util/axiosUtils'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CCardBody,
  CRow,
  CCol,
  CCard,
  CCollapse,
  CNav,
  CNavItem,
  CNavLink,
  CListGroup,
  CContainer,
  CBadge,
  CForm,
  CFormTextarea,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
} from '@coreui/react-pro'

import CIcon from '@coreui/icons-react'
import { cilPencil, cilPlus, cilX } from '@coreui/icons'
import Tasks from './Subtasks'
import Fields from './Fields'
import { getUserGraphDetails } from 'src/util/taskUtils'

const Pratica = ({ pratica, visible, onClose, labelColor, label }) => {
  const [visibleLinks, setVisibleLinks] = useState(true)
  const [visibleCorr, setVisibleCorr] = useState(false)
  const [visibleLogs, setVisibleLogs] = useState(false)
  const [superioriInvitati, setSuperioriInvitati] = useState([])
  const [responsabiliAssegnati, setResponsabiliAssegnati] = useState([])
  const [createdBy, setCreatedBy] = useState('')
  const [modifiedBy, setModifiedBy] = useState('')
  const [isView, setIsView] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  const [toast, addToast] = useState(0)
  const [loading, setLoading] = useState(false)

  const toaster = useRef()

  useEffect(() => {
    setIsView(true)
    const getAssignedUsers = async () => {
      const token = await getAccessToken()
      const axiosInstance = createAxiosInstance(token)
      let superiori
      let responsabili
      let superioriSystemUserIDs
      let responsabiliSystemUserIDs

      try {
        // Perform same operations for both invited superiors and assigned responsible
        if (pratica.cr9b3_praticaid) {
          const responseSuperiori = await axiosInstance.get(
            `cr9b3_praticas?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}'&$expand=cr9b3_pratica_superiore`,
          )
          superiori = responseSuperiori.data.value[0].cr9b3_pratica_superiore
          superioriSystemUserIDs = superiori.map((user) => user.azureactivedirectoryobjectid)

          const responseResponsabili = await axiosInstance.get(
            `cr9b3_praticas?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}'&$expand=cr9b3_pratica_responsabile`,
          )
          responsabili = responseResponsabili.data.value[0].cr9b3_pratica_responsabile
          responsabiliSystemUserIDs = responsabili.map((user) => user.azureactivedirectoryobjectid)

          // Fetch user details for each `systemuserid`
          const superiorUserDetailsPromises = superioriSystemUserIDs.map(async (userID) => {
            return await getUserGraphDetails(userID)
          })
          const responsabileUserDetailsPromises = responsabiliSystemUserIDs.map(async (userID) => {
            return await getUserGraphDetails(userID)
          })

          const createdByPromise = await axiosInstance.get(
            `systemusers(${pratica._createdby_value})`,
          )
          const modifiedByPromise = await axiosInstance.get(
            `systemusers(${pratica._modifiedby_value})`,
          )
          // const modifiedBy = await getUserGraphDetails(pratica._modifiedby_value)

          // Wait for all user details to be fetched
          const superiorUsersDetails = await Promise.all(superiorUserDetailsPromises)
          setSuperioriInvitati(superiorUsersDetails)
          const responsabileUsersDetails = await Promise.all(responsabileUserDetailsPromises)
          setResponsabiliAssegnati(responsabileUsersDetails)

          setCreatedBy(createdByPromise.data.fullname)
          setModifiedBy(modifiedByPromise.data.fullname)
          console.log(pratica._createdby_value, createdByPromise.data.fullname)

          console.log('responsabile graph details:', responsabileUsersDetails)
        }
      } catch (error) {
        if (error.isAxiosError) {
          console.error('Axios error getting user ID:', error.response)
          console.error('Error message:', error.message)
          console.error('Error response:', error.response.data)
        } else {
          console.error('Non-Axios error:', error)
        }
      }
      // return userID
    }
    getAssignedUsers()
  }, [pratica])

  // const onSaveEdit = (pratica) => {
  //   console.log('ON SAVE EDIT', pratica)
  //   //check if changes were made
  // }

  const onSaveEdit = async (pratica) => {
    console.log(pratica)
    setLoading(true)

    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)
    let response
    let praticaDetailsResponse
    let entityUrl

    try {
      console.log('editing pratica', pratica.cr9b3_praticaid)
      response = await axiosInstance.patch(`cr9b3_praticas(${pratica.cr9b3_praticaid})`, pratica)
      // Get the OData-EntityId from the response headers
      entityUrl = response.headers['odata-entityid']

      if (entityUrl) {
        console.log(`Pratica edited! Entity URL: ${entityUrl}`)
        setLoading(false)
        addToast(successCreateTaskToast)

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
        <div className="fw-bold me-auto">Edit Pratica</div>
        {/* <small>7 min ago</small> */}
      </CToastHeader>
      <CToastBody>All set! Your changes were saved.</CToastBody>
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

  return (
    <>
      <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
      <CModal
        backdrop="static"
        visible={visible}
        onClose={onClose}
        aria-labelledby="StaticBackdropExampleLabel"
        size="xl"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">
            Prat. No. {pratica.cr9b3_prano} / Prot. {pratica.cr9b3_protno}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCardBody className="p-3">
            <CRow>
              <CCol className="mb-3 scrollable-container">
                <CBadge color={labelColor} className="mb-2">
                  {label}
                </CBadge>
                <h3>{pratica.cr9b3_titolo}</h3>
                <span className="fw-bold">Istruzioni superiori: </span>
                {pratica.cr9b3_istruzioneda} - {pratica.cr9b3_istruzionesuperiori}
                {/* <CRow className="mt-4">
                <Tasks />
              </CRow> */}
                <Fields
                  pratica={pratica}
                  label={label}
                  superioriInvitati={superioriInvitati}
                  responsabile={responsabiliAssegnati}
                  isView={isView}
                  isSuccess={isSuccess}
                  onSaveEdit={onSaveEdit}
                  loading={loading}
                />
                <CCardBody className="text-body-secondary font-size-sm lh-2 m-4">
                  <CRow>
                    Created by {createdBy} on {moment(pratica.createdon).format('DD/MM/YYYY HH:mm')}
                  </CRow>
                  {/* <CRow>
                  Forwarded to responsabile on{' '}
                  {moment(initialPratica.cr9b3_datainoltrataresponsabile).format('DD/MM/YYYY')}
                </CRow> */}
                  <CRow>
                    Last modified by {modifiedBy} on{' '}
                    {moment(pratica.modifiedon).format('DD/MM/YYYY HH:mm')}
                  </CRow>
                </CCardBody>
              </CCol>

              {/* NAV LINKS */}

              <CCol xs={6} className="mt-2 overflow-auto">
                <CNav variant="underline" className="mb-3">
                  <CNavItem>
                    <CNavLink
                      active={visibleLinks}
                      onClick={() => {
                        setVisibleCorr(false)
                        setVisibleLinks(true)
                        setVisibleLogs(false)
                      }}
                    >
                      Links
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink
                      active={visibleCorr}
                      onClick={() => {
                        setVisibleCorr(true)
                        setVisibleLinks(false)
                        setVisibleLogs(false)
                      }}
                    >
                      Correspondence
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink
                      active={visibleLogs}
                      onClick={() => {
                        setVisibleCorr(false)
                        setVisibleLinks(false)
                        setVisibleLogs(true)
                      }}
                    >
                      Activity log
                    </CNavLink>
                  </CNavItem>
                </CNav>
                {/* CORRESPONDENCE */}
                <CCollapse visible={visibleCorr}>
                  <CButton color="light" className="mb-3">
                    <CIcon
                      icon={cilPlus}
                      className="text-body-secondary icon-link"
                      // onClick={() => {
                      //   toggleDetails(item.prat_no)
                      // }}
                    />
                    Add correspondence
                  </CButton>
                  <CContainer className="scrollable-container"></CContainer>
                </CCollapse>
                {/* LINKS */}
                <CCollapse visible={visibleLinks}>
                  <CCard className="mb-3">
                    <CCardBody>
                      <h6>RELATED PRATICA</h6>
                      {/* <CListGroup flush>
                      <CListGroupItem>
                        <CLink>Share QSN Convention_report-compressé.pdf</CLink>
                      </CListGroupItem>
                    </CListGroup> */}
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="light" className="mt-3">
                          <CIcon icon={cilPlus} className="me-md-2" />
                          Add link
                        </CButton>
                      </div>
                    </CCardBody>
                  </CCard>
                  <CCard className="mb-3">
                    <CCardBody>
                      <h6>REQUEST</h6>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="light" className="mt-3">
                          <CIcon icon={cilPlus} className="me-md-2" />
                          Add link
                        </CButton>
                      </div>
                    </CCardBody>
                  </CCard>
                  <CCard className="mb-3">
                    <CCardBody>
                      <h6>FOLLOW UP</h6>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="light" className="mt-3">
                          <CIcon icon={cilPlus} className="me-md-2" />
                          Add link
                        </CButton>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCollapse>

                {/* ACTIVITY LOG */}
                <CCollapse visible={visibleLogs}>
                  <CCard className="mb-3">
                    <CCardBody className="scrollable-container">
                      <CListGroup flush></CListGroup>
                    </CCardBody>
                  </CCard>
                </CCollapse>
              </CCol>
            </CRow>
          </CCardBody>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Pratica
