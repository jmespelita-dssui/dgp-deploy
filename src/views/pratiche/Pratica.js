/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
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
} from '@coreui/react-pro'

import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import Tasks from './Subtasks'
import Fields from './Fields'

const Pratica = ({ pratica, visible, onClose, labelColor, label }) => {
  const [visibleLinks, setVisibleLinks] = useState(true)
  const [visibleCorr, setVisibleCorr] = useState(false)
  const [visibleLogs, setVisibleLogs] = useState(false)
  const [superioriInvitati, setSuperioriInvitati] = useState([])

  useEffect(() => {
    const getSuperioriInvitati = async () => {
      const token = await getAccessToken()
      const axiosInstance = createAxiosInstance(token)
      let users
      let systemUserIDs

      try {
        // console.log('getting superiori invitati for pratica id:', pratica.cr9b3_praticaid)
        if (pratica.cr9b3_praticaid) {
          const response = await axiosInstance.get(
            `cr9b3_praticas?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}'&$expand=cr9b3_pratica_superiore`,
          )
          users = response.data.value[0].cr9b3_pratica_superiore
          systemUserIDs = users.map((user) => user.azureactivedirectoryobjectid)

          // Fetch user details for each `systemuserid`
          const userDetailsPromises = systemUserIDs.map(async (userID) => {
            return await getUserGraphDetails(userID)
          })

          // Wait for all user details to be fetched
          const usersDetails = await Promise.all(userDetailsPromises)
          setSuperioriInvitati(usersDetails)
          // console.log('user graph details:', usersDetails)
        }
      } catch (error) {
        if (error.isAxiosError) {
          console.error('Axios error getting superior ID:', error.response)
          console.error('Error message:', error.message)
          console.error('Error response:', error.response.data)
        } else {
          console.error('Non-Axios error:', error)
        }
      }
      // return userID
    }
    getSuperioriInvitati()
  }, [pratica])

  const getUserGraphDetails = async (userID) => {
    try {
      const token = await getAccessTokenForGraph()
      const axiosInstance = createAxiosInstance(token)

      // Fetch user details using systemuserid
      const response = await axiosInstance.get(`https://graph.microsoft.com/v1.0/users/${userID}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user details:', error)
      return null
    }
  }

  return (
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
              {pratica.cr9b3_istruzionesuperiori}
              <CRow className="mt-4">
                <Tasks />
              </CRow>
              <Fields pratica={pratica} label={label} superioriInvitati={superioriInvitati} />
              {/* <ProgettoEsterno pratica={pratica} /> */}
              <CForm>
                <CFormTextarea
                  id="notes"
                  label="Note"
                  rows={3}
                  text="Ulteriori dettagli"
                ></CFormTextarea>
              </CForm>
              <CCardBody className="text-body-secondary font-size-sm lh-2 m-4">
                <CRow>Created on {moment(pratica.createdon).format('DD/MM/YYYY')} </CRow>
                <CRow>
                  Forwarded to responsabile on{' '}
                  {moment(pratica.cr9b3_datainoltrataresponsabile).format('DD/MM/YYYY')}
                </CRow>
                <CRow>
                  Last modified by {pratica.cr9b3_modificatoda} on{' '}
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
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default Pratica
