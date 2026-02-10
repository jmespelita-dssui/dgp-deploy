import { initializeAxiosInstance } from './axiosUtils'
import { getCurrentUser, getUserName } from './accessUtils'

export const fetchNotifications = async () => {
  const axiosInstance = await initializeAxiosInstance()
  const systemuserid = (await getCurrentUser()).systemuserid
  try {
    const res = await axiosInstance.get('/cr9b3_notifications', {
      params: {
        $filter: `_cr9b3_systemuser_value eq ${systemuserid}`,
        $orderby: 'createdon desc',
      },
    })

    const notifications = res.data.value
    // console.log('Fetched notifications:', notifications)
    return notifications
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

export const markAllAsRead = async (notifications) => {
  const axiosInstance = await initializeAxiosInstance()
  const updatePromises = notifications
    .filter((n) => !n.cr9b3_read)
    .map((notif) =>
      axiosInstance.patch(`cr9b3_notifications(${notif.cr9b3_notificationid})`, {
        cr9b3_read: true,
      }),
    )
  try {
    await Promise.all(updatePromises)
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error marking all as read:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
}

export const markAsRead = async (notification) => {
  const axiosInstance = await initializeAxiosInstance()
  try {
    await axiosInstance.patch(`cr9b3_notifications(${notification.cr9b3_notificationid})`, {
      cr9b3_read: true,
    })
    const updatedNotifs = await fetchNotifications()
    return updatedNotifs
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error marking all as read:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
}

export const sendNotificationtoUser = async (assignTo, desc, type, praticaID) => {
  const axiosInstance = await initializeAxiosInstance()
  const actor = await getCurrentUser()
  try {
    // let systemUserIDs = await Promise.all(assignTo.map((user) => getSystemUserID(user.id)))
    const actorName = await getUserName(actor.systemuserid)
    const assignToUsername = await getUserName(assignTo)
    console.log('Creating notification:', assignToUsername, actorName, desc, type, praticaID)

    await axiosInstance.post('/cr9b3_notifications', {
      cr9b3_description: desc,
      cr9b3_type: type,
      cr9b3_pratica: praticaID,
      cr9b3_actor: actorName,
      cr9b3_read: false,
      'cr9b3_SystemUser@odata.bind': `/systemusers(${assignTo})`,
    })
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error assigning notification:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
}
