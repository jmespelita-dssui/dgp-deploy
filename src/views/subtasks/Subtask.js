/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import {
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CCard,
  CCardFooter,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CButton,
  CContainer,
  CBadge,
  CDatePicker,
  CCollapse,
} from '@coreui/react-pro'

import { useToast } from 'src/context/ToastContext'
import { PeoplePicker, Person } from '@microsoft/mgt-react'
import ConfirmClose from '../modals/ConfirmAction'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilChevronCircleDownAlt, cilChevronCircleUpAlt } from '@coreui/icons'
import moment from 'moment'
import { assignUserToTask } from 'src/services/praticaService'
import LoadingOverlay from '../modals/LoadingOverlay'
import {
  getCurrentUser,
  getSystemUserID,
  getTaskUserIDs,
  getUserGraphDetails,
  getUserName,
  giveAccessViaTask,
} from 'src/services/accessService'
import apiClient from 'src/util/apiClient'

const Subtask = ({ task, refreshTask, pratica, responsabile, officialiIncaricati }) => {
  const [isExpand, setIsExpand] = useState(false)
  const [isReassigned, setIsReassigned] = useState(false)
  const [isHidden, setIsHidden] = useState(true)
  const [taskDetails, setTaskDetails] = useState()
  const [assignedUsers, setAssignedUsers] = useState([])
  const [taskEdits, setTaskEdits] = useState()
  const [statusLabel, setStatusLabel] = useState()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState()
  const [assignedUsersSystemUserIDs, setAssignedUsersSystemUserIDs] = useState([])
  const [createdBy, setCreatedBy] = useState('')
  const [modifiedBy, setModifiedBy] = useState('')

  const [loading, setLoading] = useState(false)
  const [visibleConfirmClose, setVisibleConfirmClose] = useState(false)
  const { addToast } = useToast()

  const options = [
    { label: 'Nuovo', value: '0', color: 'cyan' },
    { label: 'In corso', value: '1', color: 'warning' },
    { label: 'In sospeso', value: '2', color: 'gray' },
    { label: 'In attesa di approvazione', value: '3', color: 'purple' },
    { label: 'Completato', value: '4' },
  ]

  useEffect(() => {
    setStatus(task.cr9b3_status)
    setTaskDetails(task)
    getCreatedBy().then((creator) => {
      setCreatedBy(creator)
    })
    getModifiedBy().then((modifier) => {
      setModifiedBy(modifier)
    })
    if (!task.cr9b3_comments) {
      setComments([])
    } else {
      setComments(JSON.parse(task.cr9b3_comments))
      setComment('')
    }
    setIsReassigned()
    getAssignedUsers()
  }, [task])

  const reset = async () => {
    refreshTask()
    setIsReassigned(false)
    await getAssignedUsers()
  }

  const deleteTask = async () => {
    setLoading(true)
    setVisibleConfirmClose(false)
    try {
      //
      await apiClient.delete(`cr9b3_taskses(${task.cr9b3_tasksid})`).then(() => {
        addToast('Task eliminato con successo.', 'Elimina subtask', 'success', 3000)
      })
    } catch (error) {
      addToast("Errore durante l'eliminazione del task.", 'Elimina subtask', 'warning', 3000)
      if (error.isAxiosError) {
        console.error('Axios error deleting subtask:', error.response)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response.data)
      } else {
        console.error('Non-Axios error:', error)
      }
    } finally {
      setIsHidden(true)
      setLoading(false)
      refreshTask()
    }
  }

  const saveComment = async () => {
    const currentUser = await getCurrentUser()
    const now = new Date().toISOString()
    const commentEntry = {
      timestamp: now,
      email: currentUser.userDetails.internalemailaddress,
      comment: comment,
    }

    try {
      let response = await apiClient.patch(`cr9b3_taskses(${task.cr9b3_tasksid})`, {
        cr9b3_comments: JSON.stringify([commentEntry, ...comments]),
      })
      if (response.status === 204) {
        setComments([commentEntry, ...comments])
        setComment('')
      }
    } catch (error) {
      if (error.isAxiosError) {
        console.error('Axios error details adding comment:', error.response)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response.data)
      } else {
        console.error('Non-Axios error:', error)
      }
    }
  }

  const setStatus = (value) => {
    const status = options.find((s) => s.value === String(value))
    setStatusLabel(status)
    // setTaskStatus(value)
  }

  const getAssignedUsers = async () => {
    let assignedUserIDs
    if (task.cr9b3_tasksid) {
      assignedUserIDs = await getTaskUserIDs(task)
    }

    const detailsPromises = assignedUserIDs.azureactivedirectoryobjectid.map(async (userID) => {
      return await getUserGraphDetails(userID)
    })

    const assignedUsersDetails = await Promise.all(detailsPromises)
    setAssignedUsers(assignedUsersDetails)
    setAssignedUsersSystemUserIDs(assignedUserIDs.systemuserid)
    // console.log('assignedusersystemuserids', assignedUserIDs.systemuserid)
  }

  const saveTask = async () => {
    let usersToAssign = []
    let usersToUnassign = []
    let newAssignedUsersList = []

    let response

    if (isReassigned) {
      try {
        newAssignedUsersList = await Promise.all(
          assignedUsers.map(async (id) => {
            return getSystemUserID(id)
          }),
        )

        //determine which users were removed
        usersToUnassign = assignedUsersSystemUserIDs.filter(
          (value) => !newAssignedUsersList.includes(value),
        )

        //determine which users were added
        usersToAssign = newAssignedUsersList.filter(
          (value) => !assignedUsersSystemUserIDs.includes(value),
        )

        //axios delete users
        if (usersToUnassign.length > 0) {
          console.log('users to unassign', usersToUnassign)
          usersToUnassign.map(async (id) => {
            response = await apiClient.delete(
              `cr9b3_taskses(${task.cr9b3_tasksid})/cr9b3_task_utente(${id})/$ref`,
            )
          })
        }

        //axios add users
        if (usersToAssign.length > 0) {
          console.log('users to assign', usersToAssign)
          usersToAssign.map(async (id) => {
            console.log('assigning user', id)
            giveAccessViaTask(id, pratica, responsabile, officialiIncaricati)
            assignUserToTask(id, task.cr9b3_tasksid, pratica.cr9b3_praticaid)
          })
        }
      } catch (error) {
        if (error.isAxiosError) {
          console.error('Axios error assigning user to task:', error.response)
          console.error('Error message:', error.message)
          console.error('Error response:', error.response.data)
        } else {
          console.error('Non-Axios error:', error)
        }
      }
      await reset()
    }

    if (taskEdits) {
      try {
        response = await apiClient.patch(`cr9b3_taskses(${task.cr9b3_tasksid})`, taskEdits)
        setTaskEdits(null)
      } catch (error) {
        if (error.isAxiosError) {
          console.error('Axios error saving task:', error.response)
          console.error('Error message:', error.message)
          console.error('Error response:', error.response.data)
        } else {
          console.error('Non-Axios error:', error)
        }
      }
    }
  }

  const getCreatedBy = async () => {
    try {
      const createdBy = await getUserName(task._createdby_value)
      return createdBy
    } catch (error) {
      console.error('Error getting created by user name:', error)
      return 'Unknown User'
    }
  }
  const getModifiedBy = async () => {
    try {
      const modifiedBy = await getUserName(task._modifiedby_value)
      return modifiedBy
    } catch (error) {
      console.error('Error getting modified by user name:', error)
      return 'Unknown User'
    }
  }

  return (
    <>
      <LoadingOverlay loading={loading} />

      <ConfirmClose
        visible={visibleConfirmClose}
        body={{ title: 'Elimina task', text: 'Sei sicuro di voler eliminare il task?' }}
        onCancel={() => setVisibleConfirmClose(false)}
        onContinue={deleteTask}
      />
      {taskDetails && (
        <CCard className="mb-4">
          <CCardHeader
            onClick={() => {
              if (!isHidden) {
                saveTask()
              }
              setIsHidden(!isHidden)
              setIsExpand(false)
            }}
          >
            <h6 className="m-1">
              <CIcon
                icon={!isHidden ? cilChevronCircleUpAlt : cilChevronCircleDownAlt}
                className="me-md-2 link-controls"
              />{' '}
              <span>{taskDetails.cr9b3_label}</span>
              {statusLabel.value === '4' ? (
                <CBadge shape="rounded-pill" color="success" className="mt-2">
                  Completato
                </CBadge>
              ) : (
                ''
              )}
            </h6>
          </CCardHeader>
          <CCollapse visible={!isHidden}>
            <CCardBody className="p-3">
              {isExpand ? (
                <>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormInput
                        // value={formData.cr9b3_prano ? formData.cr9b3_prano : ''}
                        value={taskDetails.cr9b3_label ? taskDetails.cr9b3_label : ''}
                        placeholder="Task label"
                        id="task-label"
                        size="lg"
                        onChange={(e) => {
                          setTaskDetails({ ...taskDetails, cr9b3_label: e.target.value })
                          setTaskEdits({ ...taskEdits, cr9b3_label: e.target.value })
                        }}
                        maxLength={100}
                        required
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-4">
                    <CCol>
                      <CFormSelect
                        aria-label="Status"
                        label="Stato"
                        //   value={formData.cr9b3_status ? formData.cr9b3_status : ''}
                        value={taskDetails.cr9b3_status ? taskDetails.cr9b3_status : 0}
                        options={options}
                        onChange={(e) => {
                          setStatus(e.target.value)
                          setTaskDetails({ ...taskDetails, cr9b3_status: e.target.value })
                          setTaskEdits({ ...taskEdits, cr9b3_status: e.target.value })
                        }}
                        //   disabled={isView}
                      />
                    </CCol>
                    <CCol>
                      <CDatePicker
                        label="Deadline"
                        date={moment(taskDetails.cr9b3_deadline).format('YYYY/MM/DD').toString()}
                        locale="it-IT"
                        onDateChange={(e) => {
                          setTaskDetails({ ...taskDetails, cr9b3_deadline: e })
                          setTaskEdits({ ...taskEdits, cr9b3_deadline: e })
                        }}
                      />
                    </CCol>
                  </CRow>
                  <p>Assegnato a</p>
                  <PeoplePicker
                    className="mb-4"
                    groupId="7430b06a-2d45-4576-b6d9-dd969da4d43b"
                    selectedPeople={assignedUsers}
                    selectionChanged={(e) => {
                      setAssignedUsers(e.target.selectedPeople)
                      setIsReassigned(true)
                      // setIsModified(true)
                    }}
                  />
                  <CFormTextarea
                    //   value={formData.cr9b3_protno ? formData.cr9b3_protno : ''}
                    value={taskDetails.cr9b3_description}
                    className="mb-5"
                    rows={3}
                    id="desc"
                    label="Description"
                    onChange={(e) => {
                      setTaskDetails({ ...taskDetails, cr9b3_description: e.target.value })
                      setTaskEdits({ ...taskEdits, cr9b3_description: e.target.value })
                    }}
                    maxLength={1000}
                    required
                  />
                  <CFormTextarea
                    value={comment}
                    className="mb-1"
                    id="desc"
                    label="Comments"
                    onChange={(e) => {
                      setComment(e.target.value)
                    }}
                    rows={3}
                    maxLength={300}
                  />
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-5">
                    <CButton
                      className="mt-3"
                      // variant="ghost"
                      color="light"
                      onClick={() => {
                        saveComment()
                      }}
                      disabled={comment.trim() === ''}
                    >
                      Invia
                    </CButton>
                  </div>
                  <CContainer className="pb-5">
                    {comments.map((post, index) => (
                      <div key={index}>
                        <CRow className="justify-content-between">
                          <CCol md={6}>
                            <small>
                              <Person className="m-1" userId={post.email} view="oneline" />
                            </small>
                          </CCol>
                          <CCol md={4} className="m-1 text-end">
                            <small style={{ color: 'gray' }}>
                              {moment(post.timestamp).format('DD/MM/YYYY HH:mm')}
                            </small>
                          </CCol>
                        </CRow>
                        <CRow className="m-2">
                          <CCol className="mb-4">{post.comment}</CCol>
                        </CRow>
                      </div>
                    ))}
                  </CContainer>
                </>
              ) : (
                <CContainer>
                  {statusLabel.value < 4 ? (
                    <CBadge shape="rounded-pill" color={statusLabel.color} className="mb-3">
                      {statusLabel.label}
                    </CBadge>
                  ) : (
                    ''
                  )}
                  <p>Descrizione: {taskDetails.cr9b3_description}</p>
                </CContainer>
              )}

              <CRow className="justify-content-between m-1">
                <CCol md={3}>
                  {isExpand && (
                    <small
                      className="link-controls text-decoration-underline delete"
                      onClick={() => {
                        setVisibleConfirmClose(true)
                      }}
                    >
                      Eliminare task
                    </small>
                  )}
                </CCol>
                <CCol md={3} className="text-end">
                  <small
                    onClick={() => {
                      if (isExpand) {
                        saveTask()
                      }
                      setIsExpand(!isExpand)
                    }}
                    className="link-controls text-decoration-underline"
                  >
                    {isExpand ? <>Save and hide</> : <>Edit</>}
                  </small>
                </CCol>
              </CRow>
              <CCardBody className="text-body-secondary font-size-sm lh-2 mt-3">
                <CRow>
                  <CCol md={9}>
                    <small>
                      Creato da {createdBy} on{' '}
                      {moment(taskDetails.createdon).format('DD/MM/YYYY HH:mm')}
                    </small>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md={9}>
                    <small>
                      Ultima modifica da {modifiedBy} on{' '}
                      {moment(taskDetails.modifiedon).format('DD/MM/YYYY HH:mm')}
                    </small>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCardBody>
          </CCollapse>

          <CCardFooter>
            <CRow className="justify-content-between">
              <CCol md={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                  {assignedUsers.map((person, index) => (
                    <Person
                      key={index}
                      className="m-1"
                      userId={person.mail}
                      showPresence
                      personCardInteraction="hover"
                    />
                  ))}
                </div>
              </CCol>
              <CCol md={4} className="m-1 text-end">
                <CIcon icon={cilCalendar} className="me-md-2" />
                <small>Due {moment(taskDetails.cr9b3_deadline).format('DD/MM/YYYY')}</small>
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
      )}
    </>
  )
}

export default Subtask
