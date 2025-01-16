import React, { useEffect } from 'react'
import { getAccessToken, createAxiosInstance } from 'src/util/axiosUtils'
import msalConfig from 'src/msalConfig'

const Dashboard = () => {
  // const [tasks, setTasks] = useState([])
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = await getAccessToken(msalConfig)
        const axiosInstance = createAxiosInstance(token)
        const response = await axiosInstance.get('crebd_tasks')
        // setTasks(response.data.value)
        console.log(response.data.value)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchTasks()
    getAccessToken()
  }, [])

  return (
    <>
      <div>Dashboard</div>
      {/* {tasks ? (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>{task.crebd_description}</li>
          ))}
        </ul>
      ) : (
        ''
      )} */}
    </>
  )
}

export default Dashboard
