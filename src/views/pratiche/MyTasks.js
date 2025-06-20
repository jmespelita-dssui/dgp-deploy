/* eslint-disable react/prop-types */
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
import { initializeAxiosInstance } from 'src/util/axiosUtils'
import { emptyTask, getLabelColor, getPratica } from 'src/util/taskUtils'

import Summary from './Summary'
import Pratica from './Pratica'
import LoadingOverlay from '../modals/LoadingOverlay'
import _access from 'src/_access'

const MyTasks = ({ isArchive }) => {
  const [praticheList, setPraticheList] = useState([])
  const [details, setDetails] = useState([])
  const [activeKey, setActiveKey] = useState(1)
  const [visible, setVisible] = useState(false)
  const [selectedPratica, setSelectedPratica] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingOverlay, setLoadingOverlay] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [hasDefaultAccess, setHasDefaultAccess] = useState()
  const [combinedTasks, setCombinedTasks] = useState()
  const [label, setLabel] = useState('')
  const [permittedTasks, setPermittedTasks] = useState([])

  useEffect(() => {
    setHasDefaultAccess(_access.defaultAccess)
    setCombinedTasks(_access.combinedTasks)
    const filterTasks = async () => {
      try {
        const axiosInstance = await initializeAxiosInstance()

        const response = await axiosInstance.get('cr9b3_praticas?$orderby=modifiedon desc')
        console.log(response.data)
        let allTasks = response.data.value
        if (isArchive) {
          allTasks = allTasks.filter((row) => row.cr9b3_status === 0)
          console.log(allTasks)
        }

        if (hasDefaultAccess) {
          setPraticheList(allTasks)
        } else {
          const allowedIDsSet = new Set(combinedTasks)
          const filteredTasks = allTasks.filter((pratica) =>
            allowedIDsSet.has(pratica.cr9b3_praticaid),
          )
          setPermittedTasks(filteredTasks)
          setPraticheList(filteredTasks)
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        if (combinedTasks) setLoading(false)
      }
    }

    filterTasks()
  }, [refreshKey, combinedTasks])

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
      console.log(newPratica)

      setLabel(getLabelColor(newPratica.cr9b3_categoria))
      setSelectedPratica(newPratica)
    } catch {
      console.log('error opening related pratica')
    } finally {
      const elapsed = Date.now() - startTime
      const delay = Math.max(3000 - elapsed, 0)
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
        permittedTasks={permittedTasks}
        label={label}
        refresh={() => setRefreshKey((prevKey) => prevKey + 1)}
        setNewPratica={setNewPratica}
      />
      <CCard className="mb-4">
        {!isArchive && (
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
                ? praticheList
                : activeKey === 1
                ? praticheList.filter((p) => p.cr9b3_status < 100 && p.cr9b3_status > 0)
                : praticheList.filter((p) => p.cr9b3_status === 100)
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
                        href={item.cr9b3_sharepointlink}
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
