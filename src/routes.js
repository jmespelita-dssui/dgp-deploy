import React from 'react'

// examples
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const MyTasks = React.lazy(() => import('./views/pratiche/MyTasks'))
const CreateTask = React.lazy(() => import('./views/createTask/CreatePratica'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/tasks', name: 'My Tasks', element: MyTasks },
  { path: '/create', name: 'Create Task', element: CreateTask },
]

export default routes
