import { initializeAxiosInstance } from './axiosUtils'

export const fetchNotifications = async () => {
  const axiosInstance = await initializeAxiosInstance()
  try {
    const response = await axiosInstance.get('cr9b3_notifications?$orderby=createdon desc')
    return response.data.value
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error getting notifs:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
}
