import React, { useState, useEffect } from 'react'

import {
  CCard,
  CCardBody,
  CSmartTable,
  CButton,
  CCollapse,
  CProgress,
  CPopover,
  CBadge,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react-pro'

import { FileList, Agenda, PeoplePicker, People, Person } from '@microsoft/mgt-react'

import {
  cilFolderOpen,
  cilList,
  cilChevronCircleDownAlt,
  cilChevronCircleUpAlt,
  cilCheckCircle,
} from '@coreui/icons'

import CIcon from '@coreui/icons-react'

import moment from 'moment'
import msalConfig from 'src/msalConfig'
import { getAccessToken, createAxiosInstance } from 'src/util/axiosUtils'

import Summary from '../pratiche/Summary'
import Pratica from '../pratiche/Pratica'

const MyTasks = () => {
  const [people, setPeople] = useState([])
  const [praticheList, setPraticheList] = useState([])
  const [details, setDetails] = useState([])
  const [activeKey, setActiveKey] = useState(1)
  const [visible, setVisible] = useState(false)
  const [selectedPratica, setSelectedPratica] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const token = await getAccessToken(msalConfig)
        const axiosInstance = createAxiosInstance(token)
        const response = await axiosInstance.get('crebd_table1s')
        setPraticheList(response.data.value)
        // console.log(token)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
    getAccessToken()
  }, [])

  const columns = [
    { key: 'summary', label: '', _style: { width: '1%' }, sorter: false },
    { key: 'open_folder', label: '', _style: { width: '1%' }, sorter: false },
    { key: 'crebd_status', label: '', _style: { width: '10%' }, sorter: false },
    { key: 'crebd_protno', label: 'Prot. No.' },
    {
      key: 'crebd_titolo',
      label: 'Title',
    },
    { key: 'crebd_categoria', label: 'Category' },
    { key: 'crebd_superioriinvitati', label: 'Invited' },
    // { key: 'crebd_', label: 'Assigned to' },
    { key: 'crebd_primascadenza', label: 'Deadline' },
  ]

  const toggleDetails = (index) => {
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails = [...details, index]
    }
    setDetails(newDetails)
  }

  const openPratica = (item) => {
    setVisible(true)
    setSelectedPratica(item)
  }

  const onClosePratica = () => {
    setVisible(false)
  }

  const convertListToArray = () => {
    let arr = []
    praticheList.map((p) => {
      arr.push({
        desc: p.desc,
        category: p.categoria,
        responsabile: p.responsabile,
        fase: p.fase,
        superiori_invitati: p.superiori_invitati,
      })
    })
    return arr
  }

  const handlePeopleSelect = (e) => {
    // console.log(e.target.selectedPeople)
    setPeople(e.target.selectedPeople)
  }

  const getLabelColor = (index) => {
    let color
    let label
    switch (index) {
      case 1:
        color = 'warning'
        label = 'RICHIESTA CONTRIBUTO'
        break
      case 2:
        color = 'info'
        label = 'PROGETTO ESTERNO'
        break
      case 3:
        color = 'secondary'
        label = 'EVENTO'
        break
      case 4:
        color = 'success'
        label = 'RICEZIONE RAPPORTI'
        break
      case 5:
        color = 'success'
        label = 'VISITA'
        break
      default:
        color = 'black'
    }
    return { color: color, label: label }
  }

  return (
    <>
      {/* {person ? (
        <Person personQuery="j.espelita@dssui.org" showName showEmail showPresence />
      ) : (
        <p>Loading...</p>
      )} */}

      {/* <FileList /> */}
      {/* <p>{praticheList[0].crebd_citta}</p> */}
      <Pratica
        visible={visible}
        onClose={onClosePratica}
        pratica={selectedPratica}
        labelColor={getLabelColor(selectedPratica.crebd_categoria).color}
        label={getLabelColor(selectedPratica.crebd_categoria).label}
      />
      <CCard className="mb-4">
        <CNav variant="tabs" className="m-3">
          <CNavItem>
            <CNavLink onClick={() => setActiveKey(1)} active={activeKey === 1}>
              Open
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => setActiveKey(2)} active={activeKey === 2}>
              Completed
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => setActiveKey(3)} active={activeKey === 3}>
              Archived
            </CNavLink>
          </CNavItem>
        </CNav>
        <CCardBody>
          <CSmartTable
            tableFilter
            cleaner
            columns={columns}
            columnSorter
            items={
              activeKey === 1
                ? praticheList.filter((p) => p.crebd_status < 3)
                : praticheList.filter((p) => p.crebd_status === 3)
              // praticheList
            }
            loading={loading}
            tableProps={{
              className: 'align-middle',
              responsive: true,
              // striped: true,
            }}
            scopedColumns={{
              summary: (item) => {
                let detailsIncludes = details.includes(item.crebd_protno)
                return (
                  <td className="table-light summary-box">
                    {detailsIncludes ? (
                      <CIcon
                        icon={cilChevronCircleUpAlt}
                        size="lg"
                        className="text-body-secondary icon-link"
                        onClick={() => {
                          toggleDetails(item.crebd_protno)
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <CPopover content="Summary" placement="top" trigger={['hover', 'focus']}>
                        <CIcon
                          icon={cilChevronCircleDownAlt}
                          size="lg"
                          className="text-body-secondary"
                          onClick={() => {
                            toggleDetails(item.crebd_protno)
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </CPopover>
                    )}
                  </td>
                )
              },
              crebd_status: (item) => {
                return (
                  <td>
                    <CPopover
                      content={
                        item.crebd_status === 1
                          ? 'New'
                          : item.crebd_status === 2
                          ? 'In progress'
                          : 'Done'
                      }
                      placement="top"
                      trigger={['hover', 'focus']}
                    >
                      <CProgress value={(Number(item.crebd_status) / 3) * 100} height={10} />
                    </CPopover>
                  </td>
                )
              },
              open_folder: (item) => {
                return (
                  <td className="py-2">
                    <CPopover
                      content="Open SharePoint folder"
                      placement="top"
                      trigger={['hover', 'focus']}
                    >
                      <a
                        href={item.crebd_cartellaprincipale}
                        className="d-inline-block text-body-secondary"
                        tabIndex={0}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <CIcon icon={cilFolderOpen} size="lg" style={{ cursor: 'pointer' }} />
                      </a>
                    </CPopover>
                  </td>
                )
              },
              crebd_titolo: (item) => {
                return (
                  <td className="">
                    <CButton
                      color="link"
                      style={{ textAlign: 'left' }}
                      onClick={() => openPratica(item)}
                    >
                      {item.crebd_titolo}
                    </CButton>
                  </td>
                )
              },
              crebd_categoria: (item) => {
                return (
                  <td>
                    <CBadge color={getLabelColor(item.crebd_categoria).color}>
                      {getLabelColor(item.crebd_categoria).label}
                    </CBadge>
                  </td>
                )
              },
              show_details: (item) => {
                return (
                  <td className="py-2">
                    <CPopover content="View details" placement="top" trigger={['hover', 'focus']}>
                      <span className="d-inline-block" tabIndex={0}>
                        <CIcon icon={cilList} size="lg" />
                      </span>
                    </CPopover>
                  </td>
                )
              },
              details: (item) => {
                return (
                  <CCollapse visible={details.includes(item.crebd_protno)}>
                    <Summary item={item} />
                  </CCollapse>
                )
              },
              prima_scadenza: (item) => {
                let testDate = moment(item.prima_scadenza, 'DD/MM/YYYY')
                let today = moment()
                let dateDiff = today.diff(testDate, 'days')
                return (
                  <td>
                    {dateDiff > -7 && dateDiff < 0 ? (
                      <CBadge color="warning" shape="rounded-pill">
                        {item.prima_scadenza}
                      </CBadge>
                    ) : dateDiff >= 0 ? (
                      <CBadge color="primary" shape="rounded-pill">
                        {item.prima_scadenza}
                      </CBadge>
                    ) : (
                      item.prima_scadenza
                    )}
                  </td>
                )
              },
            }}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default MyTasks
