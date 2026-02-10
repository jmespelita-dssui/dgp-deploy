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
import { markAllAsRead, markAsRead } from 'src/util/notifUtils'
import { filterTasks } from 'src/util/accessUtils'
import { getPratica } from 'src/util/taskUtils'
import { useAccessRights } from 'src/hooks/useAccessRights'

const AppAside = () => {
  const dispatch = useDispatch()
  const notifications = useSelector((state) => state.notifications || [])
  const asideShow = useSelector((state) => state.asideShow)
  const [praticheList, setPraticheList] = useState()
  const [permittedTasks, setPermittedTasks] = useState()
  const {
    combinedTasks,
    defaultAccess,
    loading: accessLoading,
    error: accessError,
  } = useAccessRights()

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
      filterTasks(defaultAccess, combinedTasks, false).then(({ praticheList, permittedTasks }) => {
        setPraticheList(praticheList)
        setPermittedTasks(permittedTasks)
      })
    }

    loadPratiche()
  }, [accessLoading, defaultAccess, combinedTasks])

  const onMarkNotifAsRead = async (notif) => {
    const updatedNotifs = await markAsRead(notif)
    const enriched = await Promise.all(
      updatedNotifs.map(async (notif) => {
        const pratica = await getPratica(notif.cr9b3_pratica)
        return { ...notif, pratica }
      }),
    )
    dispatch({
      type: 'set',
      payload: {
        notifications: enriched,
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
          <span className="ms-2">Mark all as read</span>
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
                praticheList={praticheList}
                permittedTasks={permittedTasks}
                markNotifAsRead={onMarkNotifAsRead}
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
                praticheList={praticheList}
                permittedTasks={permittedTasks}
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
