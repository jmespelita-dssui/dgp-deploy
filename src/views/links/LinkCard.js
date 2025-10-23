/* eslint-disable react/prop-types */
import { cilPaw, cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CContainer, CPopover } from '@coreui/react-pro'
import React, { useEffect, useState } from 'react'
import LinkRow from './LinkRow'
import LinkModal from '../modals/LinkModal'
import LoadingOverlay from '../modals/LoadingOverlay'
import { useToast } from 'src/context/ToastContext'
import { initializeAxiosInstance } from 'src/util/axiosUtils'
import {
  generateActivityLogEntry,
  getUpdatedActivityLog,
  logActivity,
} from 'src/util/activityLogUtils'
import { getUserName } from 'src/util/taskUtils'
import moment from 'moment-timezone'

const LinkCard = ({ header, links, type, praticaID, refreshLinks }) => {
  const [visible, setVisible] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    getUpdatedActivityLog(praticaID)
  }, [])

  const saveLink = async (action, link) => {
    // console.log(link)
    let newLinks
    let toastMessage
    if (action === 'add') {
      newLinks = [...links, link]
      toastMessage = 'Link successfully added.'
    } else if (action === 'edit') {
      newLinks = links.map((item) =>
        item.id === link.id ? { ...item, label: link.label, url: link.url } : item,
      )
      toastMessage = 'Link successfully edited.'
    } else {
      newLinks = links.filter((item) => item.id !== link.id)
      toastMessage = 'Link successfully deleted.'
    }
    // { cr9b3_links: newLinks.map(({ label, url }) => ({ label, url })) }
    let logEntry = generateActivityLogEntry({
      cr9b3_links: JSON.stringify([{ ...link, action: action }]),
    })
    // console.log(newLinks.map())
    setLoading(true)

    try {
      const axiosInstance = await initializeAxiosInstance()
      let response = await axiosInstance.patch(`cr9b3_praticas(${praticaID})`, {
        cr9b3_links: JSON.stringify(newLinks),
      })

      const whoami = await axiosInstance.get('WhoAmI')
      let logModifier = await getUserName(whoami.data.UserId)
      let latestLogs = await getUpdatedActivityLog(praticaID)
      // console.log(latestLogs)
      // latestLogs = JSON.parse(latestLogs)
      let finalLogEntry

      if (latestLogs) {
        finalLogEntry = [
          ...latestLogs,
          {
            user: logModifier,
            actions: logEntry,
            timestamp: moment().tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss'),
          },
        ]
      } else {
        finalLogEntry = [
          {
            user: logModifier,
            actions: logEntry,
            timestamp: moment().tz('Europe/Rome').format('YYYY-MM-DD HH:mm:ss'),
          },
        ]
      }
      // console.log('check for logs:', finalLogEntry)
      logActivity(praticaID, finalLogEntry)

      refreshLinks(newLinks)
      addToast(toastMessage, 'Edit Pratica', 'success', 3000)

      // console.log(response)
      setVisible(false)
      setLoading(false)
    } catch (error) {
      addToast('Link was not saved.', 'Edit Pratica', 'warning', 3000)
      setLoading(false)
      //   addToast('Error occurred while saving changes.', 'Edit Pratica', 'warning', 3000)
      //   setLoading(false)
      if (error.isAxiosError) {
        console.error('Axios error details adding new pratica:', error.response)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response.data)
      } else {
        console.error('Non-Axios error:', error)
      }
    }
  }

  return (
    <>
      <LoadingOverlay loading={loading} />
      <LinkModal
        visible={visible}
        onClose={() => setVisible(false)}
        action={'add'}
        saveLink={saveLink}
        type={type}
      />
      <CCard className="mb-3">
        <CCardBody>
          <h6>{header}</h6>
          <CContainer className="mt-3">
            {links
              ? links
                  .filter((link) => link.type === type)
                  .map((item, index) => (
                    <LinkRow
                      isEdit={isEdit}
                      link={item}
                      key={index}
                      type={type}
                      saveLink={saveLink}
                    />
                  ))
              : ''}
          </CContainer>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CPopover
              content={isEdit ? 'Done' : 'Show actions'}
              placement="top"
              trigger={['hover', 'focus']}
            >
              <CButton
                color={isEdit ? 'success' : 'secondary'}
                className="mt-3"
                onClick={() => setIsEdit(!isEdit)}
                variant="ghost"
              >
                {/* {isDeleteMode ? <CIcon icon={cilCheck} /> : <CIcon icon={cilPencil} />} */}
                <CIcon icon={cilPaw} />
              </CButton>
            </CPopover>
            <CButton
              color="light"
              className="mt-3"
              onClick={() => {
                setVisible(true)
                // setLinkType('request')
              }}
            >
              <CIcon icon={cilPlus} className="me-md-2" />
              Add link
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default LinkCard
