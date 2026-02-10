/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CBadge,
  CTooltip,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilApplicationsSettings, cilBell, cilMenu } from '@coreui/icons'

import { Login } from '@microsoft/mgt-react'
import { AppBreadcrumb } from './index'
import logo from 'src/assets/brand/dssui-logo.png'
import { fetchNotifications } from 'src/util/notifUtils'
import { getPratica } from 'src/util/taskUtils'

const AppHeader = () => {
  const dispatch = useDispatch()

  // Redux state
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const asideShow = useSelector((state) => state.asideShow)
  const notifCount = useSelector((state) => state.notifCount)
  const notifications = useSelector((state) => state.notifications)

  useEffect(() => {
    const getNotifsWithPratiche = async () => {
      try {
        const notifs = await fetchNotifications()
        const unreadCount = notifs.filter((n) => !n.cr9b3_read).length
        const enriched = await Promise.all(
          notifs.map(async (notif) => {
            const pratica = await getPratica(notif.cr9b3_pratica)
            return { ...notif, pratica }
          }),
        )

        // Update Redux state
        dispatch({
          type: 'set',
          payload: {
            notifications: enriched,
            notifCount: unreadCount,
          },
        })
      } catch (err) {
        console.error('Error loading notifications:', err)
      }
    }

    getNotifsWithPratiche()
  }, [dispatch, asideShow]) // refresh when asideShow toggled

  return (
    <>
      <CHeader position="sticky" className="mb-4">
        <CContainer fluid>
          <CHeaderToggler
            className="ps-1"
            onClick={() =>
              dispatch({
                type: 'set',
                payload: {
                  sidebarShow: !sidebarShow,
                },
              })
            }
          >
            <CIcon icon={cilMenu} className="gray-base" />
          </CHeaderToggler>

          <CHeaderBrand className="mx-auto d-md-none" to="/">
            <img src={logo} alt="logo" height={80} />
          </CHeaderBrand>

          <CHeaderNav className="d-none d-md-flex me-auto" />

          {/* Notifications Bell */}
          <CHeaderToggler
            className="ms-3 position-relative"
            onClick={() =>
              dispatch({
                type: 'set',
                payload: {
                  asideShow: !asideShow,
                },
              })
            }
          >
            <CTooltip content="Attività" placement="bottom" trigger={['hover', 'focus']}>
              <CBadge className="border border-light p-2" color="primary" shape="rounded-circle">
                <CIcon icon={cilBell} size="lg" />
                {notifCount > 0 && (
                  <CBadge
                    color="danger"
                    position="top-start"
                    shape="rounded-pill"
                    className="translate-middle ms-3 mt-1"
                  >
                    {notifCount} <span className="visually-hidden">unread messages</span>
                  </CBadge>
                )}
              </CBadge>
            </CTooltip>
          </CHeaderToggler>

          <CHeaderNav>
            <Login />
          </CHeaderNav>
        </CContainer>

        <CHeaderDivider />
        <CContainer fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>
    </>
  )
}

export default AppHeader
