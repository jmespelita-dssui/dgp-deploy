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

// import { FileList, Agenda, PeoplePicker, People, Person } from '@microsoft/mgt-react'

import {
  cilFolderOpen,
  cilList,
  cilChevronCircleDownAlt,
  cilChevronCircleUpAlt,
} from '@coreui/icons'

import CIcon from '@coreui/icons-react'

import moment from 'moment'
import msalConfig from 'src/msalConfig'
import { getAccessToken, createAxiosInstance } from 'src/util/axiosUtils'
import { emptyTask } from 'src/util/taskUtils'

import Summary from './Summary'
import Pratica from './Pratica'
import { Person } from '@microsoft/mgt-react'

const MyTasks = () => {
  const [praticheList, setPraticheList] = useState([])
  const [details, setDetails] = useState([])
  const [activeKey, setActiveKey] = useState(1)
  const [visible, setVisible] = useState(false)
  const [selectedPratica, setSelectedPratica] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const token = await getAccessToken(msalConfig)
        const axiosInstance = createAxiosInstance(token)
        const response = await axiosInstance.get('cr9b3_praticas?$orderby=createdon desc')
        setPraticheList(response.data.value)
        console.log(response.data.value)
        // console.log(`read ${response.data.value.length} data entries:`, response.data.value)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [refreshKey])

  const columns = [
    { key: 'summary', label: '', _style: { width: '1%' }, sorter: false },
    { key: 'open_folder', label: '', _style: { width: '1%' }, sorter: false },
    { key: 'cr9b3_status', label: '', _style: { width: '10%' }, sorter: false },
    { key: 'cr9b3_protno', label: 'Prot. No.' },
    {
      key: 'cr9b3_titolo',
      label: 'Titolo',
    },
    { key: 'cr9b3_categoria', label: 'Categoria' },
    // { key: '_cr9b3_superioriinvitati_value', label: 'Superiori Invitati' },
    // { key: 'cr9b3_', label: 'Assigned to' },
    { key: 'dssui_primascadenza', label: 'Prima Scadenza' },
    {
      key: 'createdon',
      label: 'Creato',
      sorter: (date1, date2) => {
        const a = new Date(date1.registered)
        const b = new Date(date2.registered)
        return a > b ? 1 : b > a ? -1 : 0
      },
    },
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
    // console.log('selectedPratica', item)
    setSelectedPratica(item)
  }

  const onClosePratica = () => {
    setSelectedPratica(emptyTask)
    setVisible(false)
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const getLabelColor = (index) => {
    let color
    let label
    switch (index) {
      case 129580000:
        color = 'dark'
        label = 'RICHIESTA CONTRIBUTO'
        break
      case 129580001:
        color = 'blue'
        label = 'PROGETTO ESTERNO'
        break
      case 129580002:
        color = 'indigo'
        label = 'EVENTO'
        break
      case 129580003:
        color = 'purple'
        label = 'RICEZIONE RAPPORTI'
        break
      case 129580004:
        color = 'green'
        label = 'VISITA'
        break
      case 129580005:
        color = 'teal'
        label = 'SENZA RICHIESTA - EVENTO'
        break
      case 129580006:
        color = 'cyan'
        label = 'SENZA RICHIESTA - LETTERA'
        break
      case 129580007:
        color = 'gray'
        label = 'PURTROPPO'
        break
      case 129580008:
        color = 'warning'
        label = 'GENERICO'
        break
      case 129580009:
        color = 'info'
        label = 'MESSAGGI PONTIFICI'
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
      {/* <p>{praticheList[0].cr9b3_citta}</p> */}

      <Pratica
        visible={visible}
        onClose={onClosePratica}
        pratica={selectedPratica}
        labelColor={getLabelColor(selectedPratica.cr9b3_categoria).color}
        label={getLabelColor(selectedPratica.cr9b3_categoria).label}
        refresh={() => setRefreshKey((prevKey) => prevKey + 1)}
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
            key={refreshKey}
            tableFilter
            cleaner
            columns={columns}
            columnSorter
            itemsPerPage={10}
            pagination
            items={
              // activeKey === 1
              //   ? praticheList.filter((p) => p.cr9b3_status < 100 && p.cr9b3_status > 0)
              //   : praticheList.filter((p) => p.cr9b3_status === 100 )
              // praticheList
              activeKey === 1
                ? praticheList.filter((p) => p.cr9b3_status < 100 && p.cr9b3_status > 0)
                : activeKey === 2
                ? praticheList.filter((p) => p.cr9b3_status === 100)
                : praticheList.filter((p) => p.cr9b3_status === 0)
            }
            loading={loading}
            tableProps={{
              className: 'align-middle',
              responsive: true,
              // striped: true,
            }}
            scopedColumns={{
              summary: (item) => {
                let detailsIncludes = details.includes(item.cr9b3_protno)
                return (
                  <td className="table-light summary-box">
                    {detailsIncludes ? (
                      <CIcon
                        icon={cilChevronCircleUpAlt}
                        size="lg"
                        className="text-body-secondary icon-link"
                        onClick={() => {
                          toggleDetails(item.cr9b3_protno)
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
                            toggleDetails(item.cr9b3_protno)
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </CPopover>
                    )}
                  </td>
                )
              },
              cr9b3_status: (item) => {
                return (
                  <td>
                    <CPopover
                      content={
                        item.cr9b3_status === 10
                          ? 'New'
                          : item.cr9b3_status === 30
                          ? 'In progress'
                          : item.cr9b3_status === 50
                          ? 'Pending response from recipient'
                          : item.cr9b3_status === 70
                          ? 'Pending approval from superior'
                          : item.cr9b3_status === 40
                          ? 'On hold'
                          : item.cr9b3_status === 0
                          ? 'Archived'
                          : 'Completed'
                      }
                      placement="top"
                      trigger={['hover', 'focus']}
                    >
                      <CProgress
                        value={Number(item.cr9b3_status)}
                        height={10}
                        color={
                          item.cr9b3_status === 40
                            ? 'gray'
                            : item.cr9b3_status > 10 && item.cr9b3_status < 100
                            ? 'warning'
                            : 'success'
                        }
                      />
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
                        href={item.cr9b3_cartellaprincipale}
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
              cr9b3_titolo: (item) => {
                return (
                  <td>
                    <CButton
                      color="link"
                      style={{ textAlign: 'left', padding: '0' }}
                      onClick={() => openPratica(item)}
                    >
                      {item.cr9b3_titolo}
                    </CButton>
                  </td>
                )
              },
              cr9b3_categoria: (item) => {
                return (
                  <td>
                    <CBadge color={getLabelColor(item.cr9b3_categoria).color}>
                      {getLabelColor(item.cr9b3_categoria).label}
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
                  <CCollapse visible={details.includes(item.cr9b3_protno)}>
                    <Summary item={item} />
                  </CCollapse>
                )
              },
              _cr9b3_superioriinvitati_value: (item) => {
                return (
                  <td>
                    <div style={{ display: 'flex' }}>
                      {/* <Person
                        className="m-1"
                        // userId={item._cr9b3_superioriinvitati_value}
                        userId="m.czerny@dssui.org"
                        showPresence
                        personCardInteraction="hover"
                      /> */}
                      <Person
                        className="m-1"
                        // userId={item._cr9b3_superioriinvitati_value}
                        userId="a.smerilli@dssui.org"
                        showPresence
                        personCardInteraction="hover"
                      />
                    </div>
                  </td>
                )
              },
              dssui_primascadenza: (item) => {
                let testDate = moment(item.dssui_primascadenza, 'DD/MM/YYYY')
                let today = moment()
                let dateDiff = today.diff(testDate, 'days')
                return (
                  <td>
                    {item.dssui_primascadenza &&
                      (dateDiff > -7 && dateDiff < 0 ? (
                        <CBadge color="warning" shape="rounded-pill">
                          {moment(item.dssui_primascadenza).format('DD/MM/YYYY')}
                        </CBadge>
                      ) : dateDiff >= 0 ? (
                        <CBadge color="primary" shape="rounded-pill">
                          {moment(item.dssui_primascadenza).format('DD/MM/YYYY')}
                        </CBadge>
                      ) : (
                        moment(item.dssui_primascadenza).format('DD/MM/YYYY')
                      ))}
                  </td>
                )
              },
              createdon: (item) => {
                return <td>{moment(item.createdon).format('DD/MM/YYYY hh:mm A')}</td>
              },
            }}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default MyTasks
