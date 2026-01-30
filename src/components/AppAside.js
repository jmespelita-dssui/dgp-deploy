import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CListGroup,
  CListGroupItem,
  CSidebar,
  CSidebarHeader,
  COffcanvasTitle,
  COffcanvasBody,
} from '@coreui/react-pro'
import moment from 'moment'
import Notification from 'src/views/notifications/Notification'

const AppAside = () => {
  const dispatch = useDispatch()
  const notifications = useSelector((state) => state.notifications || [])
  const asideShow = useSelector((state) => state.asideShow)

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

  return (
    <CSidebar
      colorScheme="light"
      size="lg"
      overlaid
      placement="end"
      visible={asideShow} // <-- controls visibility
      onVisibleChange={(visible) => dispatch({ type: 'set', asideShow: visible })}
    >
      <CSidebarHeader className="bg-transparent d-flex align-items-center justify-content-between">
        <COffcanvasTitle>Attività</COffcanvasTitle>
        <CCloseButton
          onClick={() => dispatch({ type: 'set', payload: { asideShow: !asideShow } })}
        />
      </CSidebarHeader>

      <COffcanvasBody>
        <CListGroup flush>
          <CListGroupItem className="border-start-4 border-start-secondary bg-body-secondary text-center fw-bold text-uppercase small">
            OGGI
          </CListGroupItem>

          {today.length > 0 ? (
            today.map((notif, index) => <Notification notif={notif} key={index} />)
          ) : (
            <CListGroupItem className="text-center text-medium-emphasis">
              Non ci sono nuove notifiche.
            </CListGroupItem>
          )}

          <CListGroupItem className="border-start-4 border-start-secondary bg-body-secondary text-center fw-bold text-uppercase small">
            PRECEDENTI
          </CListGroupItem>

          {others.length > 0 ? (
            others.map((notif, index) => <Notification notif={notif} key={index} />)
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
