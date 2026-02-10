/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'

import {
  CCard,
  CCardBody,
  CSmartTable,
  CButton,
  CCollapse,
  CProgress,
  CTooltip,
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
import { initializeAxiosInstance } from 'src/util/axiosUtils'
import { emptyTask, getLabelColor, getPratica } from 'src/util/taskUtils'

import Summary from './Summary'
import Pratica from './Pratica'
import LoadingOverlay from '../modals/LoadingOverlay'
// import _access, { setAccessRights } from 'src/_access'
import { filterTasks } from 'src/util/accessUtils'
import { useAccessRights } from 'src/hooks/useAccessRights'

const MyTasks = ({ isArchive }) => {
  const [praticheList, setPraticheList] = useState([])
  const [archiveList, setArchiveList] = useState([])
  const [details, setDetails] = useState([])
  const [activeKey, setActiveKey] = useState(1)
  const [visible, setVisible] = useState(false)
  const [selectedPratica, setSelectedPratica] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingOverlay, setLoadingOverlay] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [label, setLabel] = useState('')
  const [permittedTasks, setPermittedTasks] = useState([])
  const { combinedTasks, defaultAccess, loading: accessLoading } = useAccessRights()

  useEffect(() => {
    if (accessLoading) return
    const loadPratiche = async () => {
      setLoading(true)
      try {
        filterTasks(defaultAccess, combinedTasks, isArchive).then(
          ({ praticheList, archiveList, permittedTasks }) => {
            setPraticheList(praticheList)
            setArchiveList(archiveList)
            setPermittedTasks(permittedTasks)
            setLoading(false)
          },
        )
      } finally {
        setLoading(false)
      }
    }

    loadPratiche()
  }, [accessLoading, defaultAccess, combinedTasks])

  const columns = [
    { key: 'summary', label: '', _style: { width: '1%' }, sorter: false },
    { key: 'open_folder', label: '', _style: { width: '1%' }, sorter: false },
    { key: 'cr9b3_status', label: '', _style: { width: '10%' }, sorter: false },
    { key: 'cr9b3_protno', label: 'Prot' },
    {
      key: 'cr9b3_titolo',
      label: 'Titolo',
    },
    { key: 'cr9b3_categoria', label: 'Categoria' },
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
    setLabel(getLabelColor(item.cr9b3_categoria).label)
    setSelectedPratica(item)
  }

  const onClosePratica = () => {
    setSelectedPratica(emptyTask)
    setVisible(false)
    setRefreshKey((prevKey) => prevKey + 1)
  }

  const setNewPratica = async (pratID) => {
    setLoadingOverlay(true)
    const startTime = Date.now()
    try {
      const newPratica = await getPratica(pratID)
      // console.log(newPratica)

      setLabel(getLabelColor(newPratica.cr9b3_categoria))
      setSelectedPratica(newPratica)
    } catch {
      console.log('error opening related pratica')
    } finally {
      const elapsed = Date.now() - startTime
      const delay = Math.max(1500 - elapsed, 0)
      setTimeout(() => {
        setLoadingOverlay(false)
      }, delay)
    }
  }

  return (
    <>
      <LoadingOverlay loading={loadingOverlay} />

      <Pratica
        visible={visible}
        onClose={onClosePratica}
        pratica={selectedPratica}
        // praticheList={!isArchive ? praticheList : archiveList}
        permittedTasks={permittedTasks}
        label={label}
        // refresh={() => setRefreshKey((prevKey) => prevKey + 1)}
        setNewPratica={setNewPratica}
      />
      <CCard className="mb-4">
        {!isArchive && (
          <CNav variant="tabs" className="m-3">
            <CNavItem>
              <CNavLink onClick={() => setActiveKey(1)} active={activeKey === 1}>
                Aperto
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink onClick={() => setActiveKey(2)} active={activeKey === 2}>
                Archiviato
              </CNavLink>
            </CNavItem>
          </CNav>
        )}
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
              isArchive
                ? archiveList
                : activeKey === 1
                ? permittedTasks.filter((p) => p.cr9b3_status < 100 && p.cr9b3_status > 0)
                : permittedTasks.filter((p) => p.cr9b3_status === 100)
            }
            loading={loading}
            tableProps={{
              className: 'align-middle',
              responsive: true,
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
                      <CTooltip content="Sintesi" placement="top" trigger={['hover', 'focus']}>
                        <CIcon
                          icon={cilChevronCircleDownAlt}
                          size="lg"
                          className="text-body-secondary"
                          onClick={() => {
                            toggleDetails(item.cr9b3_protno)
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </CTooltip>
                    )}
                  </td>
                )
              },
              cr9b3_status: (item) => {
                return (
                  <td>
                    <CTooltip
                      content={
                        item.cr9b3_status === 10
                          ? 'Nuovo'
                          : item.cr9b3_status === 30
                          ? 'In corso'
                          : item.cr9b3_status === 50
                          ? 'In attesa di risposta dal destinatario'
                          : item.cr9b3_status === 70
                          ? 'In attesa di approvazione dal superiore'
                          : item.cr9b3_status === 40
                          ? 'In sospeso'
                          : item.cr9b3_status === 0
                          ? 'Archiviato'
                          : 'Completato'
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
                    </CTooltip>
                  </td>
                )
              },
              open_folder: (item) => {
                return (
                  <td className="py-2">
                    <CTooltip
                      content="Apri cartella principale"
                      placement="top"
                      trigger={['hover', 'focus']}
                    >
                      <a
                        href={item.cr9b3_sharepointlink}
                        className="d-inline-block text-body-secondary"
                        tabIndex={0}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <CIcon icon={cilFolderOpen} size="lg" style={{ cursor: 'pointer' }} />
                      </a>
                    </CTooltip>
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
                    <CTooltip content="View details" placement="top" trigger={['hover', 'focus']}>
                      <span className="d-inline-block" tabIndex={0}>
                        <CIcon icon={cilList} size="lg" />
                      </span>
                    </CTooltip>
                  </td>
                )
              },
              details: (item) => {
                return (
                  <CCollapse visible={details.includes(item.cr9b3_protno)}>
                    <Summary pratica={item} />
                  </CCollapse>
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
