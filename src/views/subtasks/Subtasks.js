/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { CButton, CCollapse, CContainer } from '@coreui/react-pro'
import ConfirmationModal from '../modals/ConfirmationModal'
import Subtask from './Subtask'
import { assignUserToTask, getSystemUserID, getTasks } from 'src/util/taskUtils'
import CreateSubtask from './CreateSubtask'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { initializeAxiosInstance } from 'src/util/axiosUtils'
import LoadingOverlay from '../modals/LoadingOverlay'
import { useToast } from 'src/context/ToastContext'

const Subtasks = ({ pratica }) => {
  const [visibleConfirmation, setVisibleConfirmation] = useState(false)
  const [tasks, setTasks] = useState()
  const [visibleCreateSubtask, setVisibleCreateSubtask] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const updateTasks = async () => {
    // console.log(pratica)
    let response
    if (pratica.cr9b3_praticaid) {
      response = await getTasks(pratica.cr9b3_praticaid)
    }
    setTasks(response)
  }

  useEffect(() => {
    setLoading(false)
    if (pratica) {
      updateTasks()
    }
  }, [pratica])

  const onCloseConfirmation = () => {
    setVisibleConfirmation(false)
  }

  const onSave = async (task, assignedUsers) => {
    let systemUserIDs
    let assignUsers
    setLoading(true)
    const axiosInstance = await initializeAxiosInstance()
    const requestBody = {
      cr9b3_id: Math.random().toString(36).substring(2, 10),
      cr9b3_label: task.label,
      cr9b3_status: typeof task.status === 'number' ? task.status : null,
      cr9b3_description: task.description,
      cr9b3_deadline: task.deadline instanceof Date ? task.deadline.toISOString() : null,
    }

    try {
      const response = await axiosInstance.post(
        `cr9b3_praticas(${pratica.cr9b3_praticaid})/cr9b3_pratica_tasks`,
        requestBody,
      )
      const getResponse = await axiosInstance.get(
        `cr9b3_praticas(${pratica.cr9b3_praticaid})/cr9b3_pratica_tasks?$filter=cr9b3_id eq '${requestBody.cr9b3_id}'`,
      )
      const taskID = getResponse.data.value[0].cr9b3_tasksid

      try {
        systemUserIDs = await Promise.all(
          assignedUsers.map(async (id) => {
            return getSystemUserID(id)
          }),
        )

        if (systemUserIDs.length > 0) {
          assignUsers = await Promise.all(
            systemUserIDs.map(async (id) => {
              assignUserToTask(id, taskID)
            }),
          )
        }
      } catch (error) {
        addToast('Error while assigning user to task', 'Edit Pratica', 'warning', 3000)
        console.error(
          'Error assigning user to task:',
          error.response ? error.response.data : error.message,
        )
      }

      setLoading(false)
      setVisibleCreateSubtask(false)
      addToast('Subtask successfully created!', 'Edit Pratica', 'success', 3000)
      updateTasks()
    } catch (error) {
      // addToast('Error adding task', 'Add task', 'warning', 3000)
      addToast('Error while creating subtask', 'Edit Pratica', 'warning', 3000)
      console.error('Error adding task:', error.response ? error.response.data : error.message)
    }
  }

  return (
    <>
      <LoadingOverlay loading={loading} />

      <ConfirmationModal
        visible={visibleConfirmation}
        onClose={onCloseConfirmation}
        onSubmit={onCloseConfirmation}
        // popupMsg={popupMsg}
      />
      <CContainer>
        <CCollapse visible={!visibleCreateSubtask}>
          <CButton
            color="light"
            className="mt-3 mb-3"
            onClick={() => setVisibleCreateSubtask(true)}
          >
            <CIcon icon={cilPlus} className="me-md-2" color="light" />
            Add new task
          </CButton>
        </CCollapse>
        {/* {visibleCreateSubtask && ( */}
        <CCollapse visible={visibleCreateSubtask}>
          <CreateSubtask onSave={onSave} onCancel={() => setVisibleCreateSubtask(false)} />
        </CCollapse>
        {/* )} */}

        {tasks &&
          tasks.map((task, index) => <Subtask key={index} task={task} refreshTask={updateTasks} />)}
      </CContainer>
    </>
  )
}

export default Subtasks
