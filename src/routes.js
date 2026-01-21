import React from 'react'
import AdminConsole from './views/admin/AdminConsole'

// examples
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const MyTasks = React.lazy(() => import('./views/pratiche/MyTasks'))
const CreateTask = React.lazy(() => import('./views/createTask/CreatePratica'))
const Archive = React.lazy(() => import('./views/pratiche/Archive'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/le-mie-pratiche', name: 'Le mie pratiche', element: MyTasks },
  { path: '/creare-pratica', name: 'Creare pratica', element: CreateTask },
  { path: '/cestino', name: 'Cestino', element: Archive },
  { path: '/admin-console', name: 'Admin Console', element: AdminConsole },
]

export default routes
