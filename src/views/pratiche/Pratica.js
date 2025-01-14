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
  CProgress,
  CPopover,
} from '@coreui/react-pro'

import CIcon from '@coreui/icons-react'
import { cilPencil, cilPlus, cilX } from '@coreui/icons'
import Fields from './Fields'
import { getSystemUserID, getUserGraphDetails, assignUserToTask } from 'src/util/taskUtils'
import { useToast } from 'src/context/ToastContext'
import LoadingOverlay from '../modals/LoadingOverlay'
import ConfirmClose from '../modals/ConfirmClose'

const Pratica = ({ pratica, visible, onClose, labelColor, label, refresh }) => {
  const [visibleLinks, setVisibleLinks] = useState(true)
  const [visibleCorr, setVisibleCorr] = useState(false)
  const [visibleLogs, setVisibleLogs] = useState(false)
  const [visibleConfirmClose, setVisibleConfirmClose] = useState(false)
  const [status, setStatus] = useState('')
  const [confirmCloseBody, setConfirmCloseBody] = useState({
    title: 'Confirm',
    text: 'Your changes may not have been saved. Continue?',
  })
  const [superioriInvitati, setSuperioriInvitati] = useState([])
  const [superioriSystemUserIDs, setSuperioriSystemUserIDs] = useState([])
  // const [superioriAzureIDs, setSuperioriAzureIDs] = useState([])
  const [responsabiliAssegnati, setResponsabiliAssegnati] = useState([])
  const [responsabiliSystemUserIDs, setResponsabiliSystemUserIDs] = useState([])
  const [officialiIncaricati, setOfficialiIncaricati] = useState([])
  const [officialiIncaricatiSystemUserIDs, setOfficialiIncaricatiUserIDs] = useState([])
  const [createdBy, setCreatedBy] = useState('')
  const [modifiedBy, setModifiedBy] = useState('')
  const [isView, setIsView] = useState(true)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    setIsView(true)
    getAssignedUsers()
    setStatus(pratica.cr9b3_status)
    setLoading(false)
  }, [pratica])

  const getUserIDs = async (tableName) => {
    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)
    let user
    let azureactivedirectoryobjectid
    let systemuserid
    const response = await axiosInstance.get(
      `cr9b3_praticas?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}'&$expand=${tableName}`,
    )
    if (tableName == 'cr9b3_pratica_superiore') {
      user = response.data.value[0].cr9b3_pratica_superiore
    } else if (tableName == 'cr9b3_pratica_responsabile') {
      user = response.data.value[0].cr9b3_pratica_responsabile
    } else if (tableName == 'cr9b3_pratica_officiali_incaricati') {
      user = response.data.value[0].cr9b3_pratica_officiali_incaricati
    }

    azureactivedirectoryobjectid = user.map((user) => user.azureactivedirectoryobjectid)
    systemuserid = user.map((user) => user.systemuserid)

    return {
      azureactivedirectoryobjectid: azureactivedirectoryobjectid,
      systemuserid: systemuserid,
    }
  }

  const getAssignedUsers = async () => {
    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)

    try {
      // Perform same operations for both invited superiors and assigned responsible
      if (pratica.cr9b3_praticaid) {
        const superioriIDs = await getUserIDs('cr9b3_pratica_superiore')
        const responsabiliIDs = await getUserIDs('cr9b3_pratica_responsabile')
        const officialiIncaricatiIDs = await getUserIDs('cr9b3_pratica_officiali_incaricati')

        const superiorUserDetailsPromises = superioriIDs.azureactivedirectoryobjectid.map(
          async (userID) => {
            return await getUserGraphDetails(userID)
          },
        )

        const responsabileUserDetailsPromises = responsabiliIDs.azureactivedirectoryobjectid.map(
          async (userID) => {
            return await getUserGraphDetails(userID)
          },
        )
        const officialiIncaricatiUserDetailsPromises =
          officialiIncaricatiIDs.azureactivedirectoryobjectid.map(async (userID) => {
            return await getUserGraphDetails(userID)
          })

        // Wait for all user details to be fetched
        const superiorUsersDetails = await Promise.all(superiorUserDetailsPromises)
        setSuperioriInvitati(superiorUsersDetails)
        setSuperioriSystemUserIDs(superioriIDs.systemuserid)

        const responsabileUsersDetails = await Promise.all(responsabileUserDetailsPromises)
        setResponsabiliAssegnati(responsabileUsersDetails)
        setResponsabiliSystemUserIDs(responsabiliIDs.systemuserid)

        const officialiIncaricatiDetails = await Promise.all(officialiIncaricatiUserDetailsPromises)
        setOfficialiIncaricati(officialiIncaricatiDetails)
        setOfficialiIncaricatiUserIDs(officialiIncaricatiIDs.systemuserid)

        // Get system information on creator and modifier
        const createdByPromise = await axiosInstance.get(`systemusers(${pratica._createdby_value})`)
        const modifiedByPromise = await axiosInstance.get(
          `systemusers(${pratica._modifiedby_value})`,
        )
        setCreatedBy(createdByPromise.data.fullname)
        setModifiedBy(modifiedByPromise.data.fullname)
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

  const showConfirmClose = () => {
    if (!isView) {
      setVisibleConfirmClose(true)
    } else {
      onClose()
    }
  }

  const onExitConfirmClose = () => {
    setVisibleConfirmClose(false)
    onClose()
  }

  const onSaveEdit = async (
    pratica,
    superioriInvitatiList,
    responsabileList,
    officialiIncaricatiList,
  ) => {
    setLoading(true)
    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)
    let newSuperioriList = []
    let newResponsabiliList = []
    let newOfficialiIncaricatiList = []
    let response
    let praticaDetailsResponse
    let entityUrl

    // console.log('assigning/unassigning superiors pre edit', superioriSystemUserIDs)
    try {
      newSuperioriList = await Promise.all(
        superioriInvitatiList.map(async (id) => {
          return getSystemUserID(id)
        }),
      )

      let superioriToUnassign = superioriSystemUserIDs.filter(
        (value) => !newSuperioriList.includes(value),
      )
      // console.log('superioriToUnassign', superioriToUnassign)

      let superioriToAssign = newSuperioriList.filter(
        (value) => !superioriSystemUserIDs.includes(value),
      )
      // console.log('superioriToAssign', superioriToAssign)

      if (superioriToUnassign.length > 0) {
        superioriToUnassign.map(async (id) => {
          response = await axiosInstance.delete(
            `cr9b3_praticas(${pratica.cr9b3_praticaid})/cr9b3_pratica_superiore(${id})/$ref`,
          )
        })
      }
      if (superioriToAssign.length > 0) {
        superioriToAssign.map(async (id) => {
          assignUserToTask(id, pratica.cr9b3_praticaid, 'cr9b3_pratica_superiore')
        })
      }
    } catch (error) {
      addToast('Error unassigning/assigning superior', 'Edit Pratica', 'warning', 3000)
      console.log('Error unassigning superior', error)
    }

    // console.log('assigning/unassigning responsabile pre edit', responsabiliSystemUserIDs)
    try {
      newResponsabiliList = await Promise.all(
        responsabileList.map(async (id) => {
          return getSystemUserID(id)
        }),
      )

      let responsabiliToUnassign = responsabiliSystemUserIDs.filter(
        (value) => !newResponsabiliList.includes(value),
      )
      // console.log('responsabiliToUnassign', responsabiliToUnassign)

      let responsabiliToAssign = newResponsabiliList.filter(
        (value) => !responsabiliSystemUserIDs.includes(value),
      )
      // console.log('responsabiliToAssign', responsabiliToAssign)

      if (responsabiliToUnassign.length > 0) {
        responsabiliToUnassign.map(async (id) => {
          response = await axiosInstance.delete(
            `cr9b3_praticas(${pratica.cr9b3_praticaid})/cr9b3_pratica_responsabile(${id})/$ref`,
          )
        })
      }
      if (responsabiliToAssign.length > 0) {
        responsabiliToAssign.map(async (id) => {
          assignUserToTask(id, pratica.cr9b3_praticaid, 'cr9b3_pratica_responsabile')
        })
      }
    } catch (error) {
      addToast('Error assigning superior', 'Edit Pratica', 'warning', 3000)
      console.log('Error assigning superior', error)
    }

    console.log('assigning/unassigning officali incaricati pre edit', officialiIncaricati)
    try {
      newOfficialiIncaricatiList = await Promise.all(
        officialiIncaricatiList.map(async (id) => {
          return getSystemUserID(id)
        }),
      )

      let officialiIncaricatiToUnassign = officialiIncaricatiSystemUserIDs.filter(
        (value) => !newOfficialiIncaricatiList.includes(value),
      )
      // console.log('responsabiliToUnassign', responsabiliToUnassign)

      let officialiIncaricatiToAssign = newOfficialiIncaricatiList.filter(
        (value) => !officialiIncaricatiSystemUserIDs.includes(value),
      )
      // console.log('responsabiliToAssign', responsabiliToAssign)

      if (officialiIncaricatiToUnassign.length > 0) {
        officialiIncaricatiToUnassign.map(async (id) => {
          response = await axiosInstance.delete(
            `cr9b3_praticas(${pratica.cr9b3_praticaid})/cr9b3_pratica_officiali_incaricati(${id})/$ref`,
          )
        })
      }
      if (officialiIncaricatiToAssign.length > 0) {
        officialiIncaricatiToAssign.map(async (id) => {
          assignUserToTask(id, pratica.cr9b3_praticaid, 'cr9b3_pratica_officiali_incaricati')
        })
      }
    } catch (error) {
      addToast('Error assigning superior', 'Edit Pratica', 'warning', 3000)
      console.log('Error assigning superior', error)
    }

    try {
      console.log('editing pratica', pratica.cr9b3_praticaid)
      setStatus(pratica.cr9b3_status)

      response = await axiosInstance.patch(`cr9b3_praticas(${pratica.cr9b3_praticaid})`, pratica)
      // Get the OData-EntityId from the response headers
      entityUrl = response.headers['odata-entityid']

      if (entityUrl) {
        console.log(`Pratica edited! Entity URL: ${entityUrl}`)
        setLoading(false)
        addToast('Success! Your changes have been saved.', 'Edit Pratica', 'success', 3000)

        // Retrieve the details of the created record
        praticaDetailsResponse = await axiosInstance.get(entityUrl)
      } else {
        addToast('Error occurred while saving changes.', 'Edit Pratica', 'warning', 3000)
        console.error('Entity URL not returned in the response headers.')
      }
      return praticaDetailsResponse
    } catch (error) {
      addToast('Error occurred while saving changes.', 'Edit Pratica', 'warning', 3000)
      if (error.isAxiosError) {
        console.error('Axios error details adding new pratica:', error.response)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response.data)
      } else {
        console.error('Non-Axios error:', error)
      }
    }
    getAssignedUsers()
  }

  const changeMode = (view) => {
    setIsView(view)
  }

  return (
    <>
      <LoadingOverlay loading={loading} />
      <ConfirmClose
        visible={visibleConfirmClose}
        body={confirmCloseBody}
        onCancel={() => setVisibleConfirmClose(false)}
        onExit={onExitConfirmClose}
      />
      <CModal
        backdrop="static"
        visible={visible}
        onClose={onClose}
        aria-labelledby="StaticBackdropExampleLabel"
        size="xl"
      >
        <CModalHeader>
          <CCol md={3}>
            <CModalTitle id="StaticBackdropExampleLabel">
              Prat. No. {pratica.cr9b3_prano} / Prot. {pratica.cr9b3_protno}
            </CModalTitle>
          </CCol>

          {/* <CPopover
            content={
              status === 10
                ? 'New'
                : status === 30
                ? 'In progress'
                : status === 50
                ? 'Pending response from recipient'
                : status === 70
                ? 'Pending approval from superior'
                : status === 40
                ? 'On hold'
                : status === 0
                ? 'Archived'
                : 'Completed'
            }
            placement="top"
            trigger={['hover', 'focus']}
          > */}
          <CCol md={8} className="m-3">
            <CProgress
              value={Number(status)}
              height={10}
              color={status === 40 ? 'gray' : status > 10 && status < 100 ? 'warning' : 'success'}
              variant="striped"
              animated
            />
          </CCol>
          {/* </CPopover> */}
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
                  superioriInvitati={superioriInvitati}
                  responsabile={responsabiliAssegnati}
                  officialiIncaricati={officialiIncaricati}
                  onSaveEdit={onSaveEdit}
                  isView={isView}
                  loading={loading}
                  setIsView={changeMode}
                  forceRerender={refresh}
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
          <CButton color="secondary" onClick={showConfirmClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Pratica
