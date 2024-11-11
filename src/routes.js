import React from 'react'

// examples
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const MyTasks = React.lazy(() => import('./views/myTasks/MyTasks'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/tasks', name: 'My Tasks', element: MyTasks },
]

export default routes
