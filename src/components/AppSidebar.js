import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react-pro'

import { AppSidebarNav } from './AppSidebarNav'

import sygnet from 'src/assets/brand/sygnet.png'
import logo from 'src/assets/brand/dssui-logo.png'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import { checkAdminAccess } from 'src/services/accessService'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [hasAdminAccess, setHasAdminAccess] = React.useState(false)

  useEffect(() => {
    checkAdminAccess().then((isAdmin) => {
      setHasAdminAccess(isAdmin)
    })
  }, [])

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) =>
        dispatch({
          type: 'set',
          payload: { sidebarShow: visible },
        })
      }
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
        <img className="sidebar-brand-narrow" src={sygnet} alt="logo" height={40} />
        <img className="sidebar-brand-full" src={logo} alt="logo" height={80} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav
            items={
              hasAdminAccess
                ? navigation
                : navigation.filter((item) => item.name !== 'Admin Console')
            }
          />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() =>
          dispatch({
            type: 'set',
            payload: { sidebarUnfoldable: !unfoldable },
          })
        }
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
