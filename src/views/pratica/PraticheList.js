/* eslint-disable react/prop-types */
import React, { useState } from 'react'

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
  CCardTitle,
} from '@coreui/react-pro'

import {
  cilFolderOpen,
  cilList,
  cilChevronCircleDownAlt,
  cilChevronCircleUpAlt,
} from '@coreui/icons'

import CIcon from '@coreui/icons-react'

import moment from 'moment'
import { getLabelColor } from 'src/services/praticaService'

import Summary from './Summary'

const PraticheList = ({
  columns,
  isArchive,
  archiveList,
  refreshKey,
  permittedPratiche,
  loading,
  openPratica,
}) => {
  const [activeKey, setActiveKey] = useState(1)
  const [details, setDetails] = useState([])

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

  return (
    <CCard className="mb-4">
      <CCardBody>
        {!isArchive && (
          <>
            <CCardTitle className="mb-4">Le mie pratiche</CCardTitle>
            <CNav variant="tabs" className="m-3">
              <CNavItem>
                <CNavLink onClick={() => setActiveKey(1)} active={activeKey === 1}>
                  Pratiche attive
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink onClick={() => setActiveKey(2)} active={activeKey === 2}>
                  Pratiche concluse
                </CNavLink>
              </CNavItem>
            </CNav>
          </>
        )}
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
              ? permittedPratiche.filter((p) => p.cr9b3_status < 100 && p.cr9b3_status > 0)
              : permittedPratiche.filter((p) => p.cr9b3_status === 100)
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
              let testDate = moment(item.dssui_primascadenza, 'D/MM/YYYY')
              let today = moment()
              let dateDiff = today.diff(testDate, 'days')
              return (
                <td>
                  {item.dssui_primascadenza &&
                    (dateDiff > -7 && dateDiff < 0 ? (
                      <CBadge color="warning" shape="rounded-pill">
                        {moment(item.dssui_primascadenza).format('D/MM/YYYY')}
                      </CBadge>
                    ) : dateDiff >= 0 ? (
                      <CBadge color="primary" shape="rounded-pill">
                        {moment(item.dssui_primascadenza).format('D/MM/YYYY')}
                      </CBadge>
                    ) : (
                      moment(item.dssui_primascadenza).format('D/MM/YYYY')
                    ))}
                </td>
              )
            },
            createdon: (item) => {
              return <td>{moment(item.createdon).format('D/MM/YYYY hh:mm A')}</td>
            },
          }}
        />
      </CCardBody>
    </CCard>
  )
}

export default PraticheList
