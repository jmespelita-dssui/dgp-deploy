import apiClient from 'src/util/apiClient'
import { getCurrentUser, getUserName } from './accessService'
import { getPratica } from './praticaService'

export const fetchNotifications = async () => {
  const systemuserid = (await getCurrentUser()).systemuserid
  try {
    const res = await apiClient.get('/cr9b3_notifications', {
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

export const getNotifsWithPratiche = async () => {
  try {
    const notifs = await fetchNotifications()
    const unreadCount = notifs.filter((n) => !n.cr9b3_read).length
    const enriched = await Promise.all(
      notifs.map(async (notif) => {
        const pratica = await getPratica(notif.cr9b3_pratica)
        return { ...notif, pratica }
      }),
    )
    return { notifications: enriched, notifCount: unreadCount }
  } catch (err) {
    console.error('Error loading notifications:', err)
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

    await apiClient.post('/cr9b3_notifications', {
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
