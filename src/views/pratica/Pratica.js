/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone'

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
import { cilFolderOpen, cilGroup } from '@coreui/icons'
import Fields from './Fields'
import { assignUserToPratica, checkIfExistingProt } from 'src/services/praticaService'
import { useToast } from 'src/context/ToastContext'
import LoadingOverlay from '../modals/LoadingOverlay'
import ConfirmClose from '../modals/ConfirmAction'
import Correspondences from '../corr/Correspondences'
import RelatedPratica from '../links/RelatedPratica'
import Links from '../links/Links'
import ActivityLogs from '../activityLog/ActivityLogs'
import {
  generateActivityLogEntry,
  getUpdatedActivityLog,
  logActivity,
} from 'src/services/activityLogService'
import Subtasks from '../subtasks/Subtasks'
import ManageAccess from '../access/ManageAccess'
import {
  getCurrentUser,
  getSystemUserID,
  getUserGraphDetails,
  getUserName,
} from 'src/services/accessService'
import { sendNotificationtoUser } from 'src/services/notificationService'
import apiClient from 'src/util/apiClient'

const Pratica = ({
  pratica,
  permittedTasks,
  visible,
  onClose,
  // labelColor,
  label,
  setNewPratica,
}) => {
  const [visibleLinks, setVisibleLinks] = useState(true)
  const [visibleTasks, setVisibleTasks] = useState(false)
  const [visibleCorr, setVisibleCorr] = useState(false)
  const [visibleLogs, setVisibleLogs] = useState(false)
  const [visibleAccess, setVisibleAccess] = useState(false)

  const [visibleConfirmClose, setVisibleConfirmClose] = useState(false)
  const [status, setStatus] = useState()
  const [sharepointLink, setSharePointLink] = useState()
  const [confirmCloseBody, setConfirmCloseBody] = useState({
    title: 'Conferma',
    text: 'Le modifiche potrebbero non essere state salvate. Continuare?',
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
  // const [categoryLabel, setCategoryLabel] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const [modifiedBy, setModifiedBy] = useState('')
  const [isView, setIsView] = useState(true)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const [actionType, setActionType] = useState('')
  const [activityLogs, setActivityLogs] = useState([])
  const [activityLogEntry, setActivityLogEntry] = useState()
  const [isSaved, setIsSaved] = useState(false)
  const [modifiedByUserID, setModifiedByUserID] = useState('')

  useEffect(() => {
    // console.log('starting pratica', pratica)
    if (pratica) {
      setVisibleLinks(true)
      setVisibleTasks(false)
      setVisibleCorr(false)
      setVisibleLogs(false)
      setVisibleAccess(false)
      setPratNo(pratica.cr9b3_prano)
      setProtNo(pratica.cr9b3_protno)
      setSharePointLink(pratica.cr9b3_sharepointlink)
      setActivityLogs(pratica.cr9b3_activitylog ? JSON.parse(pratica.cr9b3_activitylog) : [])
      getAssignedUsers()
      getRelatedPratiche()
      setStatus(pratica.cr9b3_status)
      setLoading(false)
      setIsView(true)
      setIsSaved(false)
    }
  }, [pratica])

  const getStatus = (statusNo) => {
    switch (Number(statusNo)) {
      case 10:
        return 'Nuovo'
      case 30:
        return 'In corso'
      case 50:
        return 'In attesa di risposta dal destinatario'
      case 70:
        return 'In attesa di approvazione dal superiore'
      case 40:
        return 'In sospeso'
      case 0:
        return 'Archiviato'
      case 100:
        return 'Completato'
      default:
        return
    }
  }

  const getRelatedPratiche = async () => {
    if (pratica.cr9b3_praticaid) {
      try {
        const response = await apiClient.get(
          `cr9b3_praticas?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}'&$expand=cr9b3_related_pratica`,
        )
        // console.log(response.data.value)
        setRelatedPratiche(response.data.value[0].cr9b3_related_pratica)
      } catch (error) {
        if (error.isAxiosError) {
          console.error('Errore Axios nel recupero della pratica correlata:', error.response)
          console.error('Messaggio di errore:', error.message)
          console.error('Risposta di errore:', error.response.data)
        } else {
          console.error('Errore non Axios:', error)
        }
      }
    }
  }

  const getUserIDs = async (tableName) => {
    let user
    let azureactivedirectoryobjectid
    let systemuserid
    const response = await apiClient.get(
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
    let timestamp = moment().tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss')
    // console.log(isSaved)
    if (isSaved) {
      setLoading(true)
      // console.log('checking for logs')
      let logs = await getUpdatedActivityLog(pratica.cr9b3_praticaid)
      if (actionType === 'archived pratica.' || actionType === 'unarchived pratica.') {
        finalLogEntry = [
          ...logs,
          {
            actionType: actionType,
            user: modifiedByUserID,
            actions: null,
            timestamp: timestamp,
          },
        ]
      } else {
        finalLogEntry = [
          ...logs,
          {
            actionType: actionType,
            user: modifiedByUserID,
            actions: activityLogEntry,
            timestamp: moment().tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss'),
          },
        ]
        // console.log('check for logs:', finalLogEntry)
        logActivity(pratica.cr9b3_praticaid, finalLogEntry)
      }
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
    // console.log(prat)

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
    if (exists && prat.cr9b3_protno !== protNo) {
      addToast(
        'Esiste già una pratica con lo stesso numero di protocollo!',
        'Modifica pratica',
        'warning',
        3000,
      )
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
          response = await apiClient.delete(
            `cr9b3_praticas(${prat.cr9b3_praticaid})/cr9b3_pratica_superiore(${id})/$ref`,
          )
          sendNotificationtoUser(
            id,
            'La tua assegnazione alla pratica è stata rimossa.',
            'unassign',
            prat.cr9b3_praticaid,
          )
        })
      }

      //axios add superiors
      if (superioriToAssign.length > 0) {
        superioriToAssign.map(async (id) => {
          assignUserToPratica(id, prat.cr9b3_praticaid, 'cr9b3_pratica_superiore')
        })
      }
    } catch (error) {
      addToast(
        'Errore durante la rimozione/assegnazione del superiore',
        'Modifica pratica',
        'warning',
        3000,
      )
      console.error('Errore durante la rimozione del superiore', error)
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
          response = await apiClient.delete(
            `cr9b3_praticas(${prat.cr9b3_praticaid})/cr9b3_pratica_responsabile(${id})/$ref`,
          )
          sendNotificationtoUser(
            id,
            'La tua assegnazione alla pratica è stata rimossa.',
            'unassign',
            prat.cr9b3_praticaid,
          )
        })
      }

      //axios add responsible
      if (responsabiliToAssign.length > 0) {
        responsabiliToAssign.map(async (id) => {
          assignUserToPratica(id, prat.cr9b3_praticaid, 'cr9b3_pratica_responsabile')
        })
      }
    } catch (error) {
      addToast('Errore durante l’assegnazione del superiore', 'Modifica pratica', 'warning', 3000)
      console.error('Errore durante l’assegnazione del superiore', error)
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
          response = await apiClient.delete(
            `cr9b3_praticas(${prat.cr9b3_praticaid})/cr9b3_pratica_officiali_incaricati(${id})/$ref`,
          )
          sendNotificationtoUser(
            id,
            'ha rimosso la tua assegnazione.',
            'unassign',
            prat.cr9b3_praticaid,
          )
        })
      }

      //axios add officiali
      if (officialiIncaricatiToAssign.length > 0) {
        officialiIncaricatiToAssign.map(async (id) => {
          assignUserToPratica(id, prat.cr9b3_praticaid, 'cr9b3_pratica_officiali_incaricati')
        })
      }
    } catch (error) {
      addToast('Errore durante l’assegnazione del officiale', 'Modifica pratica', 'warning', 3000)
      console.error('Errore durante l’assegnazione del officiale', error)
    }

    try {
      let allAssignedUsers = [
        ...newResponsabiliList,
        ...newOfficialiIncaricatiList,
        ...newSuperioriList,
      ]
      if (!prat.cr9b3_status || Number(prat.cr9b3_status) === Number(status)) {
        console.log('no change')
      } else if (
        Number(prat.cr9b3_status) !== Number(status) &&
        Number(prat.cr9b3_status) !== 100
      ) {
        let newStatus = getStatus(Number(prat.cr9b3_status))
        console.log(
          'change of status?',
          Number(prat.cr9b3_status),
          Number(status),
          prat.cr9b3_status !== status,
        )
        console.log('Send notification to:', allAssignedUsers)
        allAssignedUsers.map(async (id) => {
          console.log('notifying user', id, newStatus)
          sendNotificationtoUser(id, newStatus, 'status', prat.cr9b3_praticaid)
        })
      } else if (Number(prat.cr9b3_status) === 100) {
        allAssignedUsers.map(async (id) => {
          console.log('notifying user', id)
          // assignUserToTask(id, task.cr9b3_tasksid, pratica.cr9b3_praticaid)
          sendNotificationtoUser(id, '', 'completed', prat.cr9b3_praticaid)
        })
      }

      setStatus(prat.cr9b3_status)
      response = await apiClient.patch(`cr9b3_praticas(${prat.cr9b3_praticaid})`, prat)

      // Get the OData-EntityId from the response headers
      entityUrl = response.headers['odata-entityid']
      // Retrieve the details of the created record
      const currentUser = await getCurrentUser()
      let logModifier = await getUserName(currentUser.systemuserid)
      setModifiedByUserID(logModifier)

      setIsSaved(true)
      setActivityLogEntry(
        generateActivityLogEntry(
          prat,
          superioriToUnassign.length + superioriToAssign.length > 0 ? superioriInvitatiList : null,
          responsabiliToUnassign.length + responsabiliToAssign.length > 0 ? responsabileList : null,
          officialiIncaricatiToUnassign.length + officialiIncaricatiToAssign.length > 0
            ? officialiIncaricatiList
            : null,
          responsabileList,
          officialiIncaricatiList,
        ),
      )
      if (entityUrl) {
        if (action === 'archive') {
          setIsSaved(true)
          addToast('La pratica è stata archiviata.', 'Modifica pratica', 'warning', 3000)
          setActionType('pratica archiviata.')
          checkForLogs()
        } else if (action === 'unarchive') {
          setIsSaved(true)
          setActionType('pratica de-archiviata.')
          checkForLogs()
          addToast('La pratica è stata de-archiviata.', 'Modifica pratica', 'success', 3000)
        } else {
          addToast(
            'Successo! Le modifiche sono state salvate.',
            'Modifica pratica',
            'success',
            3000,
          )
          setSharePointLink(prat.cr9b3_sharepointlink)
          setLoading(false)
          setIsView(true)
          if (prat.cr9b3_prano) setPratNo(prat.cr9b3_prano)
          if (prat.cr9b3_protno) setProtNo(prat.cr9b3_protno)
        }
        setResponsabiliAssegnati(responsabileList)
        setOfficialiIncaricati(officialiIncaricatiList)
      } else {
        addToast(
          'Si è verificato un errore durante il salvataggio delle modifiche.',
          'Modifica pratica',
          'warning',
          3000,
        )
        setLoading(false)
        console.error('L’URL dell’entità non è stato restituito negli header della risposta.')
      }

      return praticaDetailsResponse
    } catch (error) {
      addToast(
        'Si è verificato un errore durante il salvataggio delle modifiche.',
        'Modifica pratica',
        'warning',
        3000,
      )
      setLoading(false)
      if (error.isAxiosError) {
        console.error(
          'Dettagli errore Axios durante l’aggiunta di una nuova pratica:',
          error.response,
        )
        console.error('Messaggio di errore:', error.message)
        console.error('Risposta di errore:', error.response.data)
      } else {
        console.error('Errore non Axios:', error)
      }
    }

    getAssignedUsers()
  }

  const changeMode = (view) => {
    setIsView(view)
  }

  const deletePratica = async () => {
    try {
      setLoading(true)
      apiClient
        .delete(`cr9b3_praticas(${pratica.cr9b3_praticaid})`)
        .then(() => {
          addToast('Pratica cancellato con successo.', 'Modifica pratica', 'success', 3000)
          // fetchData()
          setVisibleConfirmClose(false)
          // setvisible
        })
        .catch((error) => {
          addToast(
            "C'è stato un errore durante la cancellazione della pratica.",
            'Modifica pratica',
            'danger',
            3000,
          )
          console.error('Error deleting permission:', error)
        })
        .finally(() => {
          onClose()
          setLoading(false)
        })
    } catch (error) {
      addToast(
        'Errore durante la rimozione/assegnazione della pratica',
        'Modifica pratica',
        'warning',
        3000,
      )
      console.error('Errore durante la rimozione della pratica', error)
    }
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
      {pratica && (
        <CModal backdrop="static" visible={visible} onClose={() => checkForLogs()} size="xl">
          <CModalHeader className="d-flex justify-content-center">
            <CCol md={3}>
              <CModalTitle id="Pratica">
                Prat. No. {pratNo} / Prot. {protNo}
              </CModalTitle>
            </CCol>

            <CCol md={8}>
              <CProgress
                value={Number(status)}
                height={10}
                color={status === 40 ? 'gray' : status > 10 && status < 100 ? 'warning' : 'success'}
                variant="striped"
                animated
              />
            </CCol>
          </CModalHeader>
          <CModalBody>
            <CCardBody className="p-3">
              <CRow>
                <CCol className="mb-3 scrollable-container">
                  <Fields
                    pratica={pratica}
                    // categoryLabel={categoryLabel}
                    superioriInvitati={superioriInvitati}
                    responsabile={responsabiliAssegnati}
                    officialiIncaricati={officialiIncaricati}
                    onSaveEdit={onSaveEdit}
                    isView={isView}
                    loading={loading}
                    setIsView={changeMode}
                    onDeletePratica={deletePratica}
                    // forceRerender={refresh}
                    // labelColor={labelColor}
                    label={label}
                  />
                  <CCardBody className="text-body-secondary font-size-sm lh-2 m-4">
                    <CRow>
                      Creato da {createdBy} on{' '}
                      {moment(pratica.createdon).format('DD/MM/YYYY HH:mm')}
                    </CRow>
                    <CRow>
                      {pratica.cr9b3_status === 0 ? 'Archiviato da' : 'Ultima modifica'} da{' '}
                      {modifiedBy} il {moment(pratica.modifiedon).format('DD/MM/YYYY HH:mm')}
                    </CRow>
                  </CCardBody>
                </CCol>

                {/* NAV LINKS */}

                <CCol xs={6} className="mt-2 overflow-auto scrollable-container">
                  <CNav variant="underline" className="mb-3 d-flex justify-content-center">
                    <CNavItem>
                      <CNavLink
                        active={visibleLinks}
                        onClick={() => {
                          setVisibleCorr(false)
                          setVisibleTasks(false)
                          setVisibleLinks(true)
                          setVisibleAccess(false)
                          setVisibleLogs(false)
                        }}
                      >
                        Links
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={visibleTasks}
                        onClick={() => {
                          setVisibleCorr(false)
                          setVisibleTasks(true)
                          setVisibleLinks(false)
                          setVisibleAccess(false)
                          setVisibleLogs(false)
                        }}
                      >
                        To-do
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={visibleCorr}
                        onClick={() => {
                          setVisibleCorr(true)
                          setVisibleTasks(false)
                          setVisibleLinks(false)
                          setVisibleAccess(false)
                          setVisibleLogs(false)
                        }}
                      >
                        Corrispondenza
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={visibleLogs}
                        onClick={() => {
                          setVisibleCorr(false)
                          setVisibleLinks(false)
                          setVisibleTasks(false)
                          setVisibleAccess(false)
                          setVisibleLogs(true)
                        }}
                      >
                        Cronologia attività
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={visibleAccess}
                        onClick={() => {
                          setVisibleCorr(false)
                          setVisibleLinks(false)
                          setVisibleTasks(false)
                          setVisibleLogs(false)
                          setVisibleAccess(true)
                        }}
                      >
                        <CIcon icon={cilGroup} />
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                  {/* Access */}
                  <CCollapse visible={visibleAccess}>
                    <CCard className="mb-3">
                      <CCardBody>
                        <ManageAccess
                          responsabile={responsabiliAssegnati}
                          officialiIncaricati={officialiIncaricati}
                          pratica={pratica}
                          refresh={visibleAccess}
                        />
                      </CCardBody>
                    </CCard>
                  </CCollapse>

                  {/* CORRESPONDENCE */}
                  <CCollapse visible={visibleCorr}>
                    <Correspondences pratica={pratica} />
                  </CCollapse>

                  {/* Subtasks */}
                  <CCollapse visible={visibleTasks}>
                    <Subtasks
                      pratica={pratica}
                      responsabile={responsabiliAssegnati}
                      officialiIncaricati={officialiIncaricati}
                    />
                  </CCollapse>

                  {/* LINKS */}
                  <CCollapse visible={visibleLinks}>
                    {isView && (
                      <CCallout color="primary">
                        <CLink href={sharepointLink} target="_blank">
                          <CIcon icon={cilFolderOpen} />
                          <span style={{ paddingLeft: '10px' }}>Cartella principale</span>
                        </CLink>
                      </CCallout>
                    )}

                    <CCard className="mb-3">
                      <CCardBody>
                        <h6>PRATICHE CORRELATE</h6>
                        <RelatedPratica
                          relatedPratiche={relatedPratiche}
                          praticheList={permittedTasks}
                          pratica={pratica}
                          refreshRelatedPratiche={getRelatedPratiche}
                          setNewPratica={setNewPratica}
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
              Chiudi
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </>
  )
}

export default Pratica
