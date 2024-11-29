import React from 'react'

// examples
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const MyTasks = React.lazy(() => import('./views/tasks/MyTasks'))
const CreateTask = React.lazy(() => import('./views/createTask/CreateTask'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/tasks', name: 'My Tasks', element: MyTasks },
  { path: '/create', name: 'Create Task', element: CreateTask },
]

export default routes
