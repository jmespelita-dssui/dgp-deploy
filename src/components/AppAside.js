import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CListGroup,
  CListGroupItem,
  CSidebar,
  CSidebarHeader,
  COffcanvasTitle,
  COffcanvasBody,
  CButton,
  CContainer,
} from '@coreui/react-pro'
import moment from 'moment'
import Notification from 'src/views/notifications/Notification'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle } from '@coreui/icons'
import { fetchNotifications, markAllAsRead, markAsRead } from 'src/services/notificationService'
import { filterPratiche } from 'src/services/accessService'
import { useAccessRights } from 'src/hooks/useAccessRights'

const AppAside = () => {
  const dispatch = useDispatch()
  const notifications = useSelector((state) => state.notifications || [])
  const asideShow = useSelector((state) => state.asideShow)
  const [permittedPratiche, setPermittedPratiche] = useState()
  const { assignedPratiche, loading: accessLoading } = useAccessRights()

  // Separate notifications: today vs older
  const { today, others } = useMemo(
    () =>
      notifications.reduce(
        (acc, n) => {
          const isToday = moment(n.createdon, 'YYYY-MM-DD HH:mm:ss').isSame(moment(), 'day')
          if (isToday) acc.today.push(n)
          else acc.others.push(n)
          return acc
        },
        { today: [], others: [] },
      ),
    [notifications],
  )

  useEffect(() => {
    if (accessLoading) return
    const loadPratiche = async () => {
      filterPratiche(assignedPratiche, false).then(({ permittedPratiche }) => {
        setPermittedPratiche(permittedPratiche)
      })
    }
    if (assignedPratiche.length !== 0) {
      loadPratiche()
    }
  }, [accessLoading, assignedPratiche])

  const refreshNotifs = async () => {
    try {
      const notifs = await fetchNotifications()
      const unreadCount = notifs.notifs.filter((n) => !n.cr9b3_read).length
      // Update Redux state
      dispatch({
        type: 'set',
        payload: {
          notifications: notifs.enriched,
          notifCount: unreadCount,
        },
      })
    } catch (err) {
      console.error('Error loading notifications (refreshNotifs):', err)
    }
  }

  const onMarkNotifAsRead = async (notif) => {
    const updatedNotifs = await markAsRead(notif)

    dispatch({
      type: 'set',
      payload: {
        notifications: updatedNotifs.notifs,
        notifCount: 0,
      },
    })
    // setRefreshKey((prevKey) => prevKey + 1)
  }

  return (
    <CSidebar
      colorScheme="light"
      size="lg"
      overlaid
      placement="end"
      visible={asideShow} // <-- controls visibility
      onVisibleChange={(visible) =>
        dispatch({
          type: 'set',
          payload: { asideShow: visible },
        })
      }
    >
      <CSidebarHeader className="bg-transparent d-flex align-items-center justify-content-between">
        {/* <COffcanvasTitle>Attività</COffcanvasTitle> */}
        <CCloseButton
          onClick={() => dispatch({ type: 'set', payload: { asideShow: !asideShow } })}
        />
        <CButton
          variant="ghost"
          size="sm"
          className="ms-2"
          onClick={() => {
            markAllAsRead(notifications).then(() => {
              // Update Redux state
              const updatedNotifs = notifications.map((n) => ({ ...n, cr9b3_read: true }))
              dispatch({
                type: 'set',
                payload: {
                  notifications: updatedNotifs,
                  notifCount: 0,
                },
              })
            })
          }}
        >
          <CIcon icon={cilCheckCircle} />
          <span className="ms-2">Contrasegna tutte come letto</span>
        </CButton>
      </CSidebarHeader>

      <COffcanvasBody>
        <CListGroup flush>
          <CListGroupItem className="border-start-4 border-start-secondary bg-body-secondary text-center fw-bold text-uppercase small">
            OGGI
          </CListGroupItem>

          {today.length > 0 ? (
            today.map((notif, index) => (
              <Notification
                key={index}
                notif={notif}
                permittedPratiche={permittedPratiche}
                markNotifAsRead={onMarkNotifAsRead}
                refresh={refreshNotifs}
              />
            ))
          ) : (
            <CListGroupItem className="text-center text-medium-emphasis">
              Non ci sono nuove notifiche.
            </CListGroupItem>
          )}

          <CListGroupItem className="border-start-4 border-start-secondary bg-body-secondary text-center fw-bold text-uppercase small">
            PRECEDENTI
          </CListGroupItem>

          {others.length > 0 ? (
            others.map((notif, index) => (
              <Notification
                key={index}
                notif={notif}
                permittedPratiche={permittedPratiche}
                markNotifAsRead={onMarkNotifAsRead}
              />
            ))
          ) : (
            <CListGroupItem className="text-center text-medium-emphasis">
              Non ci sono altre notifiche.
            </CListGroupItem>
          )}
        </CListGroup>
      </COffcanvasBody>
    </CSidebar>
  )
}

export default React.memo(AppAside)
