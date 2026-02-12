import React from 'react'

// examples
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const MyTasks = React.lazy(() => import('./views/pratica/MyTasks'))
const CreateTask = React.lazy(() => import('./views/createPratica/CreatePratica'))
const Archive = React.lazy(() => import('./views/pratica/Archive'))
const AdminConsole = React.lazy(() => import('./views/admin/AdminConsole'))
const Search = React.lazy(() => import('./views/search/Search'))
const Page403 = React.lazy(() => import('./views/pages/Page403'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/le-mie-pratiche', name: 'Le mie pratiche', element: MyTasks },
  { path: '/creare-pratica', name: 'Creare pratica', element: CreateTask, specialAccessOnly: true },
  { path: '/cestino', name: 'Cestino', element: Archive, specialAccessOnly: true },
  { path: '/admin-console', name: 'Admin Console', element: AdminConsole, adminOnly: true },
  { path: '/search', name: 'Search', element: Search },
  { path: '/403', name: 'Page 403', element: Page403 },
]

export default routes
