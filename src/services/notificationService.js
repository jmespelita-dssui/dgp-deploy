import apiClient from 'src/util/apiClient'
import { getCurrentUser, getUserName } from './userService'

export const fetchNotifications = async () => {
  const systemuserid = (await getCurrentUser()).systemuserid
  try {
    // Fetch notifications and expand related pratica
    const res = await apiClient.get('/cr9b3_notifications', {
      params: {
        $filter: `_cr9b3_systemuser_value eq ${systemuserid}`,
        $orderby: 'createdon desc',
        $expand: 'cr9b3_notification_pratica',
      },
    })

    const notifications = res.data.value

    // Count unread
    const unreadCount = notifications.filter((n) => !n.cr9b3_read).length

    // Map to include the expanded pratica directly
    const enriched = notifications.map((n) => ({
      ...n,
      pratica: n.cr9b3_notification_pratica, // already included via $expand
    }))
    return { notifs: enriched, unreadCount }
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
  const updatePromises = notifications
    .filter((n) => !n.cr9b3_read)
    .map((notif) =>
      apiClient.patch(`cr9b3_notifications(${notif.cr9b3_notificationid})`, {
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
  try {
    await apiClient.patch(`cr9b3_notifications(${notification.cr9b3_notificationid})`, {
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
  const actor = await getCurrentUser()
  try {
    // let systemUserIDs = await Promise.all(assignTo.map((user) => getSystemUserID(user.id)))
    const actorName = await getUserName(actor.systemuserid)
    const assignToUsername = await getUserName(assignTo)
    console.log('Creating notification:', assignToUsername, actorName, desc, type, praticaID)
    if (assignTo !== actor.systemuserid) {
      await apiClient.post('/cr9b3_notifications', {
        cr9b3_description: desc,
        cr9b3_type: type,
        // cr9b3_praticaid: praticaID,
        cr9b3_actor: actorName,
        cr9b3_read: false,
        'cr9b3_notification_pratica@odata.bind': `/cr9b3_praticas(${praticaID})`,
        'cr9b3_SystemUser@odata.bind': `/systemusers(${assignTo})`,
      })
    }
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

export const requestAccess = async (pratica) => {
  // const systemuserid = await getSystemUserID(notif.)
  await sendNotificationtoUser(
    pratica._createdby_value,
    'Richiesta di accesso',
    'request access',
    pratica.cr9b3_praticaid,
  )
}
