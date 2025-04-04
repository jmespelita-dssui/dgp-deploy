/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
// import moment from 'moment'
import moment from 'moment-timezone'

import { initializeAxiosInstance } from 'src/util/axiosUtils'

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
  CProgress,
  CLink,
  CCallout,
} from '@coreui/react-pro'

import CIcon from '@coreui/icons-react'
import { cilFolderOpen } from '@coreui/icons'
import Fields from './Fields'
import {
  getSystemUserID,
  getUserGraphDetails,
  assignUserToTask,
  getFields,
  checkIfExistingProt,
  getUserName,
} from 'src/util/taskUtils'
import { useToast } from 'src/context/ToastContext'
import LoadingOverlay from '../modals/LoadingOverlay'
import ConfirmClose from '../modals/ConfirmClose'
import Correspondences from '../corr/Correspondences'
import RelatedPratica from '../links/RelatedPratica'
import Links from '../links/Links'
import ActivityLogs from '../activityLog/ActivityLogs'
import {
  generateActivityLogEntry,
  getUpdatedActivityLog,
  logActivity,
} from 'src/util/activityLogUtils'

const Pratica = ({ pratica, praticheList, visible, onClose, labelColor, refresh }) => {
  const [visibleLinks, setVisibleLinks] = useState(true)
  const [visibleCorr, setVisibleCorr] = useState(false)
  const [visibleLogs, setVisibleLogs] = useState(false)
  const [visibleConfirmClose, setVisibleConfirmClose] = useState(false)
  const [status, setStatus] = useState()
  const [sharepointLink, setSharePointLink] = useState(pratica.cr9b3_sharepointlink)
  const [confirmCloseBody, setConfirmCloseBody] = useState({
    title: 'Confirm',
    text: 'Your changes may not have been saved. Continue?',
  })
  const [pratNo, setPratNo] = useState('')
  const [protNo, setProtNo] = useState('')
  const [superioriInvitati, setSuperioriInvitati] = useState([])
  const [superioriSystemUserIDs, setSuperioriSystemUserIDs] = useState([])
  const [relatedPratiche, setRelatedPratiche] = useState([])
  const [responsabiliAssegnati, setResponsabiliAssegnati] = useState([])
  const [responsabiliSystemUserIDs, setResponsabiliSystemUserIDs] = useState([])
  const [officialiIncaricati, setOfficialiIncaricati] = useState([])
  const [officialiIncaricatiSystemUserIDs, setOfficialiIncaricatiUserIDs] = useState([])
  const [categoryLabel, setCategoryLabel] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const [modifiedBy, setModifiedBy] = useState('')
  const [isView, setIsView] = useState(true)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const [activityLogs, setActivityLogs] = useState([])
  const [activityLogEntry, setActivityLogEntry] = useState()
  const [isSaved, setIsSaved] = useState(false)
  const [modifiedByUserID, setModifiedByUserID] = useState('')

  useEffect(() => {
    // console.log('starting pratica', pratica)
    setVisibleLinks(true)
    setVisibleCorr(false)
    setVisibleLogs(false)
    setPratNo(pratica.cr9b3_prano)
    setProtNo(pratica.cr9b3_protno)
    setActivityLogs(pratica.cr9b3_activitylog ? JSON.parse(pratica.cr9b3_activitylog) : [])
    getAssignedUsers()
    getRelatedPratiche()
    setStatus(pratica.cr9b3_status)
    setLoading(false)
    setCategoryLabel(getFields(pratica.cr9b3_categoria).label)
    setIsView(true)
    setIsSaved(false)
  }, [pratica])

  const getRelatedPratiche = async () => {
    const axiosInstance = await initializeAxiosInstance()

    if (pratica.cr9b3_praticaid) {
      try {
        const response = await axiosInstance.get(
          `cr9b3_praticas?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}'&$expand=cr9b3_related_pratica`,
        )
        // console.log(response.data.value)
        setRelatedPratiche(response.data.value[0].cr9b3_related_pratica)
      } catch (error) {
        if (error.isAxiosError) {
          console.error('Axios error getting related pratica:', error.response)
          console.error('Error message:', error.message)
          console.error('Error response:', error.response.data)
        } else {
          console.error('Non-Axios error:', error)
        }
      }
    }
  }

  const getUserIDs = async (tableName) => {
    const axiosInstance = await initializeAxiosInstance()
    let user
    let azureactivedirectoryobjectid
    let systemuserid
    const response = await axiosInstance.get(
      `cr9b3_praticas?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}'&$expand=${tableName}`,
    )
    if (tableName === 'cr9b3_pratica_superiore') {
      user = response.data.value[0].cr9b3_pratica_superiore
    } else if (tableName === 'cr9b3_pratica_responsabile') {
      user = response.data.value[0].cr9b3_pratica_responsabile
    } else if (tableName === 'cr9b3_pratica_officiali_incaricati') {
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
    const axiosInstance = await initializeAxiosInstance()

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
        const createdBy = await getUserName(pratica._createdby_value)
        const modifiedBy = await getUserName(pratica._modifiedby_value)
        setCreatedBy(createdBy)
        setModifiedBy(modifiedBy)
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

  const checkForLogs = async () => {
    let finalLogEntry

    if (isSaved) {
      let logs = await getUpdatedActivityLog(pratica.cr9b3_praticaid)
      console.log(logs)
      setLoading(true)
      finalLogEntry = [
        ...logs,
        {
          user: modifiedByUserID,
          actions: activityLogEntry,
          timestamp: moment().tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss'),
        },
      ]
      console.log('check for logs:', finalLogEntry)
      logActivity(pratica.cr9b3_praticaid, finalLogEntry)
    }
    onClose()
  }

  const showConfirmClose = () => {
    if (!isView) {
      setVisibleConfirmClose(true)
    } else {
      checkForLogs()
    }
  }

  const onExitConfirmClose = () => {
    setVisibleConfirmClose(false)
    checkForLogs()
  }

  const onSaveEdit = async (
    prat,
    superioriInvitatiList,
    responsabileList,
    officialiIncaricatiList,
    action,
  ) => {
    setLoading(true)
    const axiosInstance = await initializeAxiosInstance()
    let newSuperioriList = []
    let superioriToAssign = []
    let superioriToUnassign = []
    let newResponsabiliList = []
    let responsabiliToAssign = []
    let responsabiliToUnassign = []
    let newOfficialiIncaricatiList = []
    let officialiIncaricatiToUnassign = []
    let officialiIncaricatiToAssign = []
    let response
    let praticaDetailsResponse
    let entityUrl
    let exists = await checkIfExistingProt(prat.cr9b3_protno)

    //check for duplicates if protno was changed
    if (exists && prat.cr9b3_protno !== pratica.cr9b3_protno) {
      addToast('Pratica with same protocol number already exists!', 'Edit Pratica', 'warning', 3000)
      setLoading(false)
      return
    }

    try {
      //get system user ids of all assigned superiors
      newSuperioriList = await Promise.all(
        superioriInvitatiList.map(async (id) => {
          return getSystemUserID(id)
        }),
      )

      //determine which superiors were removed
      superioriToUnassign = superioriSystemUserIDs.filter(
        (value) => !newSuperioriList.includes(value),
      )

      //determine which superiors were added
      let superioriToAssign = newSuperioriList.filter(
        (value) => !superioriSystemUserIDs.includes(value),
      )

      //axios delete superiors
      if (superioriToUnassign.length > 0) {
        superioriToUnassign.map(async (id) => {
          response = await axiosInstance.delete(
            `cr9b3_praticas(${prat.cr9b3_praticaid})/cr9b3_pratica_superiore(${id})/$ref`,
          )
        })
      }

      //axios add superiors
      if (superioriToAssign.length > 0) {
        superioriToAssign.map(async (id) => {
          assignUserToTask(id, prat.cr9b3_praticaid, 'cr9b3_pratica_superiore')
        })
      }
    } catch (error) {
      addToast('Error unassigning/assigning superior', 'Edit Pratica', 'warning', 3000)
      console.log('Error unassigning superior', error)
    }

    try {
      //get system user ids of assigned responsible
      newResponsabiliList = await Promise.all(
        responsabileList.map(async (id) => {
          return getSystemUserID(id)
        }),
      )

      //determine which responsibles were removed
      responsabiliToUnassign = responsabiliSystemUserIDs.filter(
        (value) => !newResponsabiliList.includes(value),
      )

      //determine which responsibles were added
      responsabiliToAssign = newResponsabiliList.filter(
        (value) => !responsabiliSystemUserIDs.includes(value),
      )

      //axios delete responsible
      if (responsabiliToUnassign.length > 0) {
        responsabiliToUnassign.map(async (id) => {
          response = await axiosInstance.delete(
            `cr9b3_praticas(${prat.cr9b3_praticaid})/cr9b3_pratica_responsabile(${id})/$ref`,
          )
        })
      }

      //axios add responsible
      if (responsabiliToAssign.length > 0) {
        responsabiliToAssign.map(async (id) => {
          assignUserToTask(id, prat.cr9b3_praticaid, 'cr9b3_pratica_responsabile')
        })
      }
    } catch (error) {
      addToast('Error assigning superior', 'Edit Pratica', 'warning', 3000)
      console.log('Error assigning superior', error)
    }

    try {
      //get system user ids of assigned officiali
      newOfficialiIncaricatiList = await Promise.all(
        officialiIncaricatiList.map(async (id) => {
          return getSystemUserID(id)
        }),
      )

      //determine which officiali were removed
      officialiIncaricatiToUnassign = officialiIncaricatiSystemUserIDs.filter(
        (value) => !newOfficialiIncaricatiList.includes(value),
      )

      //determine which officiali were added
      officialiIncaricatiToAssign = newOfficialiIncaricatiList.filter(
        (value) => !officialiIncaricatiSystemUserIDs.includes(value),
      )

      //axios delete officiali
      if (officialiIncaricatiToUnassign.length > 0) {
        officialiIncaricatiToUnassign.map(async (id) => {
          response = await axiosInstance.delete(
            `cr9b3_praticas(${prat.cr9b3_praticaid})/cr9b3_pratica_officiali_incaricati(${id})/$ref`,
          )
        })
      }

      //axios add officiali
      if (officialiIncaricatiToAssign.length > 0) {
        officialiIncaricatiToAssign.map(async (id) => {
          assignUserToTask(id, prat.cr9b3_praticaid, 'cr9b3_pratica_officiali_incaricati')
        })
      }
    } catch (error) {
      addToast('Error assigning superior', 'Edit Pratica', 'warning', 3000)
      console.log('Error assigning superior', error)
    }

    try {
      setStatus(prat.cr9b3_status)
      response = await axiosInstance.patch(`cr9b3_praticas(${prat.cr9b3_praticaid})`, prat)

      // Get the OData-EntityId from the response headers
      entityUrl = response.headers['odata-entityid']

      if (entityUrl) {
        if (action === 'archive') {
          addToast('Pratica has been archived.', 'Edit Pratica', 'warning', 3000)
          setTimeout(() => {
            window.location.reload() // Refresh the page after 3 seconds
          }, 2000)
        } else if (action === 'unarchive') {
          addToast('Pratica has been unarchived.', 'Edit Pratica', 'success', 3000)
          setTimeout(() => {
            window.location.reload() // Refresh the page after 3 seconds
          }, 2000)
        } else {
          addToast('Success! Your changes have been saved.', 'Edit Pratica', 'success', 3000)
          setSharePointLink(prat.cr9b3_sharepointlink)
          setLoading(false)
          setIsView(true)
          if (prat.cr9b3_prano) setPratNo(prat.cr9b3_prano)
          if (prat.cr9b3_protno) setProtNo(prat.cr9b3_protno)
        }

        // Retrieve the details of the created record
        const whoami = await axiosInstance.get('WhoAmI')
        let logModifier = await getUserName(whoami.data.UserId)
        setModifiedByUserID(logModifier)

        setIsSaved(true)
        setActivityLogEntry(
          generateActivityLogEntry(
            prat,
            superioriToUnassign.length + superioriToAssign.length > 0
              ? superioriInvitatiList
              : null,
            responsabiliToUnassign.length + responsabiliToAssign.length > 0
              ? responsabileList
              : null,
            officialiIncaricatiToUnassign.length + officialiIncaricatiToAssign.length > 0
              ? officialiIncaricatiList
              : null,
            responsabileList,
            officialiIncaricatiList,
          ),
        )
      } else {
        addToast('Error occurred while saving changes.', 'Edit Pratica', 'warning', 3000)
        setLoading(false)
        console.error('Entity URL not returned in the response headers.')
      }
      return praticaDetailsResponse
    } catch (error) {
      addToast('Error occurred while saving changes.', 'Edit Pratica', 'warning', 3000)
      setLoading(false)
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
        onContinue={onExitConfirmClose}
      />
      <CModal backdrop="static" visible={visible} onClose={() => checkForLogs()} size="xl">
        <CModalHeader>
          <CCol md={3}>
            <CModalTitle id="Pratica">
              Prat. No. {pratNo} / Prot. {protNo}
            </CModalTitle>
          </CCol>

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
                <Fields
                  pratica={pratica}
                  categoryLabel={categoryLabel}
                  superioriInvitati={superioriInvitati}
                  responsabile={responsabiliAssegnati}
                  officialiIncaricati={officialiIncaricati}
                  onSaveEdit={onSaveEdit}
                  isView={isView}
                  loading={loading}
                  setIsView={changeMode}
                  forceRerender={refresh}
                  labelColor={labelColor}
                />
                <CCardBody className="text-body-secondary font-size-sm lh-2 m-4">
                  <CRow>
                    Created by {createdBy} on {moment(pratica.createdon).format('DD/MM/YYYY HH:mm')}
                  </CRow>
                  <CRow>
                    {pratica.cr9b3_status === 0 ? 'Archived by' : 'Last modified'} by {modifiedBy}{' '}
                    on {moment(pratica.modifiedon).format('DD/MM/YYYY HH:mm')}
                  </CRow>
                </CCardBody>
              </CCol>

              {/* NAV LINKS */}

              <CCol xs={6} className="mt-2 overflow-auto scrollable-container">
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
                  <Correspondences pratica={pratica} />
                </CCollapse>
                {/* LINKS */}
                <CCollapse visible={visibleLinks}>
                  {isView && (
                    <CCallout color="primary">
                      <CLink href={sharepointLink} target="_blank">
                        <CIcon icon={cilFolderOpen} />
                        <span style={{ paddingLeft: '10px' }}>Home folder</span>
                      </CLink>
                    </CCallout>
                  )}

                  <CCard className="mb-3">
                    <CCardBody>
                      <h6>RELATED PRATICA</h6>
                      <RelatedPratica
                        relatedPratiche={relatedPratiche}
                        praticheList={praticheList}
                        pratica={pratica}
                        refreshRelatedPratiche={getRelatedPratiche}
                      />
                    </CCardBody>
                  </CCard>
                  <Links links={pratica.cr9b3_links} praticaID={pratica.cr9b3_praticaid} />
                </CCollapse>

                {/* ACTIVITY LOG */}
                <CCollapse visible={visibleLogs}>
                  <CCard className="mb-3">
                    <CCardBody>
                      <ActivityLogs activityLogs={activityLogs} />
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
