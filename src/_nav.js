import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilListRich, cilPlus, cilSearch, cilSpeedometer, cilTrash } from '@coreui/icons'
import { CNavItem } from '@coreui/react-pro'

const _nav = [
  {
    component: CNavItem,
    name: 'My tasks',
    to: '/tasks',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
    badge: {
      color: 'info-gradient',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Create task',
    to: '/create',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info-gradient',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info-gradient',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavItem,
    name: 'Archive',
    to: '/archive',
    icon: <CIcon icon={cilTrash} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info-gradient',
    //   text: 'NEW',
    // },
  },
  // {
  //   component: CNavItem,
  //   name: 'Search',
  //   to: '/search',
  //   icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
  //   // badge: {
  //   //   color: 'info-gradient',
  //   //   text: 'NEW',
  //   // },
  // },
]

export default _nav
