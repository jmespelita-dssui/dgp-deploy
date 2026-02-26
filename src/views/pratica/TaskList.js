/* eslint-disable react/prop-types */
import { cilFlagAlt } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
  CTooltip,
} from '@coreui/react-pro'
import moment from 'moment'
import React from 'react'
import { getDeadlineState } from 'src/util/date'

const TaskList = ({ todoList, setNewPratica }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return 'Nuovo'
      case 1:
        return 'In corso'
      case 2:
        return 'In sospeso'
      case 3:
        return 'In attesa di approvazione'
      case 4:
        return 'Completato'
      default:
        return 'Nuovo'
    }
  }
  return (
    <CCard className="mb-4">
      <CCardBody>
        <CCardTitle>To-do</CCardTitle>
        <CRow>
          <CCol className="my-3 mx-4">
            {todoList.length > 0 ? (
              <CTable borderless>
                <CTableBody>
                  {todoList &&
                    todoList.map((task, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <CIcon icon={cilFlagAlt} className="me-3" />
                          <CButton
                            color="link"
                            style={{ textAlign: 'left', padding: '0' }}
                            onClick={() =>
                              setNewPratica(task.cr9b3_Pratica.cr9b3_praticaid, 'task')
                            }
                          >
                            {task.cr9b3_label}
                          </CButton>
                        </CTableDataCell>

                        <CTableDataCell>{getStatusLabel(task.cr9b3_status)}</CTableDataCell>
                        <CTableDataCell>
                          {(() => {
                            const state = getDeadlineState(task.cr9b3_deadline)
                            const formatted = moment(task.cr9b3_deadline).format('D/MM/YYYY')

                            if (state.type === 'normal') {
                              return formatted
                            }

                            return (
                              <CTooltip content={state.tooltip}>
                                <CBadge color={state.color} shape="rounded-pill">
                                  {formatted}
                                </CBadge>
                              </CTooltip>
                            )
                          })()}
                        </CTableDataCell>
                        <CTableDataCell>
                          Prot. {task.cr9b3_Pratica?.cr9b3_protno} -{' '}
                          {task.cr9b3_Pratica?.cr9b3_titolo}
                        </CTableDataCell>
                        {/* <CTableDataCell>{task.cr9b3_Pratica?.cr9b3_titolo}</CTableDataCell> */}
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
            ) : (
              'Nessun task assegnato.'
            )}
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default TaskList
