import { cilPencil, cilPlus, cilTrash, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import { Person } from '@microsoft/mgt-react'
import { useToast } from 'src/context/ToastContext'
import React, { useEffect, useState } from 'react'
import { initializeAxiosInstance } from 'src/util/axiosUtils'
import AddNewAccess from './AddNewAccess'
import EditAccess from './EditAccess'
import ConfirmClose from '../modals/ConfirmClose'
import LoadingOverlay from '../modals/LoadingOverlay'

const AdminConsole = () => {
  const { addToast } = useToast()

  const [accessList, setAccessList] = useState([])
  const [visibleAddAccess, setVisibleAddAccess] = useState(false)
  const [visibleEditAccess, setVisibleEditAccess] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [visibleConfirmation, setVisibleConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch any necessary data for the admin console here
      const axiosInstance = await initializeAxiosInstance()
      // Fetch all tasks
      const response = await axiosInstance.get('cr9b3_permissions?$orderby=cr9b3_role asc')
      // console.log('all tasks', response.data)
      let access = response.data.value
      console.log('all access entries', access)
      setAccessList(access)
    } catch (error) {
      console.error('Error fetching access entries:', error)
    }
  }

  const handleAddNewAccess = async (mails) => {
    try {
      await createPermissions(mails)
      addToast('Accesso aggiunto con successo.', 'Gestisci accesso', 'success', 3000)
      setLoading(false)
      fetchData()
      setVisibleAddAccess(false)
    } catch (error) {
      addToast(
        "C'è stato un errore durante l'aggiunta dell'accesso.",
        'Gestisci accesso',
        'danger',
        3000,
      )
      console.error('Error creating permissions:', error)
    }
  }

  const createPermissions = async (users) => {
    setLoading(true)
    const axiosInstance = await initializeAxiosInstance()
    const requests = users.map((user) =>
      axiosInstance.post('/cr9b3_permissions', {
        cr9b3_userid: user.mail,
        cr9b3_role: user.role,
      }),
    )

    return Promise.all(requests)
  }

  const handleEditAccess = (user) => {
    console.log('Editing access for user:', user)
    setLoading(true)
    const axiosInstancePromise = initializeAxiosInstance()
    axiosInstancePromise
      .then((axiosInstance) =>
        axiosInstance.patch(`/cr9b3_permissions(${selectedUser.cr9b3_permissionid})`, {
          cr9b3_role: user[0].role,
        }),
      )
      .then(() => {
        addToast('Accesso aggiornato con successo.', 'Gestisci accesso', 'success', 3000)
        fetchData()
        setVisibleEditAccess(false)
        setLoading(false)
      })
      .catch((error) => {
        addToast(
          "C'è stato un errore durante l'aggiornamento dell'accesso.",
          'Gestisci accesso',
          'danger',
          3000,
        )
        setLoading(false)
        console.error('Error updating permission:', error)
      })
  }

  const handleDeleteAccess = async () => {
    console.log('Deleting access for user:', selectedUser)
    // Implement delete functionality here
    const axiosInstance = await initializeAxiosInstance()
    setLoading(true)
    axiosInstance
      .delete(`/cr9b3_permissions(${selectedUser.cr9b3_permissionid})`)
      .then(() => {
        addToast('Accesso cancellato con successo.', 'Gestisci accesso', 'success', 3000)
        fetchData()
        setVisibleConfirmation(false)
      })
      .catch((error) => {
        addToast(
          "C'è stato un errore durante la cancellazione dell'accesso.",
          'Gestisci accesso',
          'danger',
          3000,
        )
        console.error('Error deleting permission:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <LoadingOverlay loading={loading} />

      <AddNewAccess
        visible={visibleAddAccess}
        onCancel={() => setVisibleAddAccess(false)}
        onContinue={handleAddNewAccess}
      />
      <EditAccess
        visible={visibleEditAccess}
        onCancel={() => setVisibleEditAccess(false)}
        onContinue={handleEditAccess}
        user={selectedUser}
      />
      <ConfirmClose
        visible={visibleConfirmation}
        body={{
          title: 'Conferma',
          text: `Sei sicuro di voler procedere con la cancellazione dell'accesso (${selectedUser?.cr9b3_userid})?`,
        }}
        onCancel={() => setVisibleConfirmation(false)}
        onContinue={handleDeleteAccess}
        // popupMsg={popupMsg}
      />
      <CCard className="mb-4">
        <CCardBody className="p-3">
          <CRow className="pt-4 ps-4">
            <h6>GESTIONE ACCESSI</h6>
          </CRow>
          <CRow className="pt-3 pb-2 ps-4 pe-4">
            <CCol md={4}>
              <CButton color="primary" onClick={() => setVisibleAddAccess(true)}>
                <CIcon className="me-2" icon={cilPlus} />
                Aggiungi accesso
              </CButton>
            </CCol>
          </CRow>
          <CRow className="ps-5 pe-5">
            <CCol className="p-3">
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Utente</CTableHeaderCell>
                    <CTableHeaderCell>User ID</CTableHeaderCell>
                    <CTableHeaderCell>Ruolo</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {accessList
                    // .filter((person) => person.cr9b3_role === 129580000) // Filter for "admin" role
                    .map((accessItem) => (
                      <CTableRow key={accessItem.cr9b3_permissionid}>
                        <CTableDataCell>
                          <Person
                            key={accessItem.cr9b3_permissionid}
                            personQuery={accessItem.cr9b3_userid}
                            view="twoLines"
                          />
                        </CTableDataCell>
                        <CTableDataCell>{accessItem.cr9b3_userid}</CTableDataCell>
                        <CTableDataCell>
                          {/* <CIcon icon={cilPencil} />
                          <CIcon className="ms-2" icon={cilTrash} /> */}
                          <CDropdown>
                            <CDropdownToggle
                              color="link"
                              className="p-0 text-decoration-none"
                              caret
                            >
                              {accessItem.cr9b3_role === 129580000
                                ? 'AMMINISTRATORE '
                                : accessItem.cr9b3_role === 129580001
                                ? 'MANAGER '
                                : 'RESPONSABILE'}
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                onClick={() => {
                                  setSelectedUser(accessItem)
                                  setVisibleEditAccess(true)
                                }}
                              >
                                <CIcon className="me-2" icon={cilUser} /> Cambia ruolo
                              </CDropdownItem>
                              <CDropdownItem
                                onClick={() => {
                                  setSelectedUser(accessItem)
                                  setVisibleConfirmation(true)
                                }}
                              >
                                <CIcon className="me-2" icon={cilTrash} /> Cancella accesso
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default AdminConsole
