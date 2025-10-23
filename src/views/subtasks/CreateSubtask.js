/* eslint-disable react/prop-types */
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CDatePicker,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react-pro'
import { PeoplePicker } from '@microsoft/mgt-react'
import React, { useState } from 'react'

const CreateSubtask = ({ onSave, onCancel }) => {
  const [label, setLabel] = useState('')
  const [status, setStatus] = useState(0)
  const [deadline, setDeadline] = useState()
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState([])
  const [dateKey, setDateKey] = useState(0)
  const [pickerKey, setPickerKey] = useState(0)

  const options = [
    { label: 'New', value: '0', color: 'cyan' },
    { label: 'In progress', value: '1', color: 'warning' },
    { label: 'On hold', value: '2', color: 'gray' },
    { label: 'Waiting for approval', value: '3', color: 'purple' },
    { label: 'Completed', value: '4' },
  ]

  const onSubmit = async (e) => {
    e.preventDefault()
    // console.log(label, status, deadline, description)
    onSave(
      {
        label: label,
        status: parseInt(status),
        deadline: deadline,
        description: description,
        subtasks: '',
      },
      assignedTo,
    )
    resetForm()
  }

  const resetForm = () => {
    setLabel('')
    setStatus(0)
    setDeadline(undefined)
    setDescription('')
    setAssignedTo([])
    setDateKey((prev) => prev + 1)
    setPickerKey((prev) => prev + 1)
  }

  return (
    <>
      <CForm onSubmit={onSubmit}>
        <CCard className="mb-5">
          <CCardBody>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  value={label}
                  placeholder="Task label"
                  id="task-label"
                  size="lg"
                  onChange={(e) => {
                    setLabel(e.target.value)
                  }}
                  maxLength={100}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-4">
              <CCol>
                <CFormSelect
                  value={status}
                  aria-label="Status"
                  label="Status"
                  // options={[
                  //   { label: 'New', value: 0 },
                  //   { label: 'In progress', value: 1 },
                  //   { label: 'Pending response from recipient', value: 2 },
                  //   { label: 'Pending approval from superior', value: 3 },
                  //   { label: 'On hold', value: 4 },
                  //   { label: 'Completed', value: 5 },
                  // ]}
                  options={options}
                  onChange={(e) => {
                    setStatus(e.target.value)
                  }}
                />
              </CCol>
              <CCol>
                <CDatePicker
                  key={dateKey}
                  label="Deadline"
                  locale="it-IT"
                  onDateChange={(e) => {
                    setDeadline(e)
                  }}
                  required
                />
              </CCol>
            </CRow>
            <p>Assigned to</p>
            <PeoplePicker
              key={pickerKey}
              className="mb-4"
              groupId="7430b06a-2d45-4576-b6d9-dd969da4d43b"
              selectionChanged={(e) => {
                setAssignedTo(e.target.selectedPeople)
              }}
            />
            <CFormTextarea
              value={description}
              className="mb-3"
              rows={3}
              id="desc"
              label="Description"
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              maxLength={1000}
              required
            />
          </CCardBody>
          <CContainer className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
            <CButton
              color="light"
              onClick={() => {
                resetForm()
                onCancel()
              }}
            >
              Cancel
            </CButton>
            <CButton color="primary" type="submit">
              <CIcon icon={cilPlus} />
            </CButton>
          </CContainer>
        </CCard>
      </CForm>
    </>
  )
}

export default CreateSubtask
