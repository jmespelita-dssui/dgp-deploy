import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilListRich, cilPlus, cilSettings, cilTrash } from '@coreui/icons'
import { CNavItem } from '@coreui/react-pro'

const _nav = [
  {
    component: CNavItem,
    name: 'Le mie pratiche',
    to: '/le-mie-pratiche',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
    badge: {
      color: 'info-gradient',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Creare pratica',
    to: '/creare-pratica',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   // badge: {
  //   //   color: 'info-gradient',
  //   //   text: 'NEW',
  //   // },
  // },
  {
    component: CNavItem,
    name: 'Cestino',
    to: '/cestino',
    icon: <CIcon icon={cilTrash} customClassName="nav-icon" />,
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
  {
    component: CNavItem,
    name: 'Admin Console',
    to: '/admin-console',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info-gradient',
    //   text: 'NEW',
    // },
  },
]

export default _nav
