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
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
} from '@coreui/react-pro'

import { Providers } from '@microsoft/mgt-element'
// import { FileList, Agenda, PeoplePicker, People } from '@microsoft/mgt-react'
import {
  cilFolderOpen,
  cilList,
  cilChevronCircleDownAlt,
  cilChevronCircleUpAlt,
  cilCheckCircle,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import moment from 'moment'

import Summary from '../snippets/Summary'
import Pratica from '../modals/Pratica'

const Dashboard = () => {
  const [accessToken, setAccessToken] = useState([])
  const [people, setPeople] = useState([])
  const [praticheList, setPraticheList] = useState([])
  const [items, setItems] = useState([])
  const [details, setDetails] = useState([])
  const [activeKey, setActiveKey] = useState(1)
  const [visible, setVisible] = useState(false)
  const [selectedPratica, setSelectedPratica] = useState([])

  const columns = [
    { key: 'summary', label: '', _style: { width: '1%' }, sorter: false },
    { key: 'open_folder', label: '', _style: { width: '1%' }, sorter: false },
    { key: 'status', label: '', _style: { width: '10%' }, sorter: false },
    { key: 'prat_no', label: 'Prot. No.' },
    {
      key: 'titolo',
      label: 'Title',
    },
    { key: 'categoria', label: 'Category' },
    { key: 'superiori_invitati', label: 'Invited' },
    { key: 'officiale_incaricato', label: 'Assigned to' },
    { key: 'prima_scadenza', label: 'Deadline' },
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/pratiche.json')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setPraticheList(data)
      } catch (error) {
        console.error('Error fetching the data: ', error)
      }
    }
    fetchData()
    // console.log('SAMPLE DATA:', praticheList)
    setItems(convertListToArray)
  }, [])

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

  const getLabelColor = (label) => {
    let color
    switch (label) {
      case 'PROGETTO ESTERNO':
        console.log(label, 'PE', 'PROGETTO ESTERNO' === label)
        color = 'warning'
        return color
      case 'EVENTO':
        color = 'info'
        return color
      case 'RICHIESTA CONTRIBUTO':
        color = 'secondary'
        return color
      case 'RICEZIONE RAPPORTI':
        color = 'success'
        return color
      default:
        color = 'black'
        return color
    }
  }

  useEffect(() => {
    const getToken = async () => {
      try {
        const provider = Providers.globalProvider

        if (provider && provider.state === 2) {
          // 2 means the user is signed in
          const tokenResponse = await provider.getAccessToken()
          // console.log('Access Token:', tokenResponse)
          setAccessToken(tokenResponse) // Store the token if needed
        } else {
          console.log('User is not signed in.')
        }
      } catch (error) {
        console.error('Error acquiring token:', error)
      }
    }

    getToken()
  }, [])

  return (
    <>
      <Pratica
        visible={visible}
        onClose={onClosePratica}
        pratica={selectedPratica}
        labelColor={getLabelColor(selectedPratica.categoria)}
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
            // items={{activeKey===1? praticheList.filter((p) => p.status <3:p.status===3)}}
            items={
              activeKey === 1
                ? praticheList.filter((p) => p.status < 3)
                : praticheList.filter((p) => p.status === 3)
            }
            tableProps={{
              className: 'align-middle',
              responsive: true,
              // striped: true,
            }}
            scopedColumns={{
              summary: (item) => {
                let detailsIncludes = details.includes(item.prat_no)
                return (
                  <td className="table-light summary-box">
                    {detailsIncludes ? (
                      <CIcon
                        icon={cilChevronCircleUpAlt}
                        size="lg"
                        className="text-body-secondary icon-link"
                        onClick={() => {
                          toggleDetails(item.prat_no)
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
                            toggleDetails(item.prat_no)
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </CPopover>
                    )}
                  </td>
                )
              },
              status: (item) => {
                return (
                  <td>
                    <CPopover
                      content={
                        item.status === 1 ? 'New' : item.status === 2 ? 'In progress' : 'Done'
                      }
                      placement="top"
                      trigger={['hover', 'focus']}
                    >
                      <CProgress value={(Number(item.status) / 3) * 100} height={10} />
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
                        href="https://dssui.sharepoint.com/:f:/s/DSSUI/EplnmJj-Y3tOvWP05bx2pnMBr7cwGOgmnWDcOU9MGlh_kw?e=6huR2t"
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
              titolo: (item) => {
                return (
                  <td>
                    <CButton color="link" onClick={() => openPratica(item)}>
                      {item.titolo}
                    </CButton>
                  </td>
                )
              },
              categoria: (item) => {
                return (
                  <td>
                    <CBadge color={getLabelColor(item.categoria)}>
                      {item.categoria.toUpperCase()}
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
                  <CCollapse visible={details.includes(item.prat_no)}>
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

export default Dashboard
