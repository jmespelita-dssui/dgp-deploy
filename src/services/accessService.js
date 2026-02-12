import { createAxiosInstance, getAccessTokenForGraph } from '../util/axiosUtils'
import { _ } from 'core-js'
import { sendNotificationtoUser } from './notificationService'
import apiClient from 'src/util/apiClient'

export const getUserAccessList = async () => {
  try {
    // Fetch all tasks
    const response = await apiClient.get('cr9b3_permissions?$orderby=cr9b3_role asc')
    let access = response.data.value
    return access
  } catch (error) {
    console.error('Error fetching access entries:', error)
  }
}

export const checkAdminAccess = async () => {
  const access = await getUserAccessList()
  const currentUser = await getCurrentUser()

  let isAdmin = access.some(
    (item) =>
      item.cr9b3_userid === currentUser.userDetails.internalemailaddress &&
      item.cr9b3_role === 129580000,
  )
  //   setHasAdminAccess(isAdmin)
  return isAdmin
}

export const checkSpecialPermission = async () => {
  const access = await getUserAccessList()

  const currentUser = await getCurrentUser()
  // console.log(currentUser.userDetails.internalemailaddress)
  let hasSpecialAccess = access.some(
    (item) => item.cr9b3_userid === currentUser.userDetails.internalemailaddress,
  )
  // console.log(hasSpecialAccess)
  //   setHasAdminAccess(isAdmin)
  return hasSpecialAccess
}

export const getUserAccessLevel = async (accessList, userId) => {
  const accessItem = accessList.find((item) => item.cr9b3_userid === userId)
  return accessItem ? accessItem.cr9b3_role : null
}

export const giveAccess = async (userID, praticaID) => {
  const data = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${praticaID})`,
  }
  try {
    await apiClient.post(`systemusers(${userID})/cr9b3_access/$ref`, data).then(() => {
      sendNotificationtoUser(userID, 'ti ha dato accesso a una pratica', 'pratica', praticaID)
    })

    return true
  } catch (error) {
    console.error(
      'Error creating user <-> pratica record:',
      error.response ? error.response.data : error.message,
    )
    return false
  }
}

export const checkAccessToPratica = async (praticaID, userID) => {
  const response = await apiClient.get(
    `cr9b3_praticas?$filter=cr9b3_praticaid eq '${praticaID}'&$expand=cr9b3_access`,
  )
  let usersWithAccess = response.data.value[0].cr9b3_access
  // console.log(usersWithAccess)

  const exists = usersWithAccess.some((item1) => {
    const match = item1.azureactivedirectoryobjectid === userID
    return match
  })

  // console.log(exists)
  return exists
}

export const giveAccessViaTask = async (userID, pratica, responsabile, officialiIncaricati) => {
  try {
    const user = await getUser(userID)
    const actorGraphDetails = await getUserGraphDetails(user.azureactivedirectoryobjectid)
    const fullAccessList = await getFullAccessList(pratica, responsabile, officialiIncaricati)
    // console.log(actorGraphDetails, responsabile)
    const exists = fullAccessList.some((item1) => {
      const match = item1.id === actorGraphDetails.id
      return match
    })

    if (!exists) {
      // console.log('give me access!', userID, pratica.cr9b3_praticaid)
      giveAccess(userID, pratica.cr9b3_praticaid)
    }
  } catch (error) {
    console.error('Error fetching default access:', error)
    // setDefaultLoading(false)
  }
}

export const getFullAccessList = async (pratica, responsabile, officialiIncaricati) => {
  // setDefaultLoading(true)
  const superiors = await getGroupMembers('317aa3d0-a94a-4c7c-bcb9-8870cfececa4')
  const secretariat = await getGroupMembers('f67d3e5d-02c7-4d4d-8b95-834533623ad6')
  const creatorUserDetails = await getUser(pratica._createdby_value)
  const creatorGraphDetails = await getUserGraphDetails(
    creatorUserDetails.azureactivedirectoryobjectid,
  )
  const response = await apiClient.get(
    `cr9b3_praticas?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}'&$expand=cr9b3_access`,
  )
  let usersWithAccess = response.data.value[0].cr9b3_access

  const userDetailsPromises = usersWithAccess.map(async (user) => {
    return await getUserGraphDetails(user.azureactivedirectoryobjectid)
  })

  const usersWithAccessDetails = await Promise.all(userDetailsPromises)

  const defaultAccessList = [
    ...(superiors || []),
    ...(secretariat || []),
    ...(responsabile || []),
    ...(officialiIncaricati || []),
    creatorGraphDetails,
    ...usersWithAccessDetails,
  ]

  return defaultAccessList
}

export const removeAccess = async (praticaID, systemuserid) => {
  // const response = await apiClient.delete(
  //   `cr9b3_praticas(${pratica.cr9b3_praticaid})/cr9b3_access(${systemuserid})/$ref`,
  // )

  await apiClient
    .delete(`cr9b3_praticas(${praticaID})/cr9b3_access(${systemuserid})/$ref`)
    .then(() => {
      sendNotificationtoUser(
        systemuserid,
        'ti ha tolto accesso a una pratica',
        'unassign',
        praticaID,
      )
    })
}

export const getCurrentUser = async () => {
  const whoami = await apiClient.get('WhoAmI')
  const systemuserid = whoami.data.UserId
  const userDetails = await getUser(systemuserid)
  const azureactivedirectoryobjectid = userDetails.azureactivedirectoryobjectid
  const currentUser = {
    whoami: whoami,
    systemuserid: systemuserid,
    userDetails: userDetails,
    azureactivedirectoryobjectid: azureactivedirectoryobjectid,
  }
  return currentUser
}

export const getSystemUserID = async (user) => {
  //azureactivedirectoryobjectid
  // console.log('getting system user ID for', user)

  let userID
  try {
    const response = await apiClient.get(
      `systemusers?$filter=azureactivedirectoryobjectid eq '${user.id}'`,
    )
    userID = response.data.value[0].systemuserid
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error getting user ID:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
  return userID
}

export const getGroupMemberCount = async (groupID) => {
  try {
    const token = await getAccessTokenForGraph()
    const axiosInstance = createAxiosInstance(token)

    const response = await axiosInstance.get(
      `https://graph.microsoft.com/v1.0/groups/${groupID}/members?$count=true`,
      {
        headers: {
          ConsistencyLevel: 'eventual', // Required for $count to work
        },
      },
    )
    return response.data['@odata.count']
  } catch (error) {
    console.error('Error fetching group member count:', error)
    return null
  }
}

export const getGroupMembers = async (groupId) => {
  try {
    const token = await getAccessTokenForGraph()
    const axiosInstance = createAxiosInstance(token)

    const response = await axiosInstance.get(
      `https://graph.microsoft.com/v1.0/groups/${groupId}/members`,
      {
        headers: {
          ConsistencyLevel: 'eventual', // Required for $count to work
        },
      },
    )
    return response.data.value
    // return response.data['@odata.count']
  } catch (error) {
    console.error('Error fetching group member count:', error)
    return null
  }
}

export const getDefaultAccess = async () => {
  const superiors = await getGroupMembers('317aa3d0-a94a-4c7c-bcb9-8870cfececa4')
  const secretariat = await getGroupMembers('f67d3e5d-02c7-4d4d-8b95-834533623ad6')
  // const responsibles = await getGroupMembers('f67d3e5d-02c7-4d4d-8b95-834533623ad6')
  const test = await getGroupMembers('79002d73-f310-4369-93e1-cb76ef304ff7')
  const defaultAccess = [...superiors, ...secretariat, ...test]

  return defaultAccess
  // return test
}

export const getUserGraphDetails = async (userID) => {
  try {
    const token = await getAccessTokenForGraph()
    const axiosInstance = createAxiosInstance(token)

    // Fetch user details using systemuserid

    const response = await axiosInstance.get(`https://graph.microsoft.com/v1.0/users/${userID}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user details:', error)
    return null
  }
}

export const getTaskUserIDs = async (task) => {
  let user
  let azureactivedirectoryobjectid
  let systemuserid
  const response = await apiClient.get(
    `cr9b3_taskses?$filter=cr9b3_tasksid eq '${task.cr9b3_tasksid}'&$expand=cr9b3_task_utente`,
  )
  user = response.data.value[0].cr9b3_task_utente

  azureactivedirectoryobjectid = user.map((user) => user.azureactivedirectoryobjectid)
  systemuserid = user.map((user) => user.systemuserid)

  return {
    azureactivedirectoryobjectid: azureactivedirectoryobjectid,
    systemuserid: systemuserid,
  }
}

export const getUserName = async (userID) => {
  //systemuserid

  const userNamePromise = await apiClient.get(`systemusers(${userID})`)
  return userNamePromise.data.fullname
}

export const getEmailAddress = async (userID) => {
  //systemuserid

  const userNamePromise = await apiClient.get(`systemusers(${userID})`)
  return userNamePromise.data.internalemailaddress
}

export const getUser = async (userID) => {
  //systemuserid

  const userNamePromise = await apiClient.get(`systemusers(${userID})`)
  return userNamePromise.data
}

export const filterTasks = async (defaultAccess, combinedTasks, isArchive) => {
  let archiveList
  let praticheList
  let permittedTasks
  try {
    // Fetch all tasks
    const response = await apiClient.get('cr9b3_praticas?$orderby=createdon desc')
    // console.log('all tasks', response.data)
    let allTasks = response.data.value
    // console.log('all tasks', allTasks)

    if (isArchive) {
      archiveList = allTasks.filter((row) => row.cr9b3_status === 0)
    }

    if (defaultAccess) {
      praticheList = allTasks
      permittedTasks = allTasks
    } else {
      const allowedIDsSet = new Set(combinedTasks)
      // console.log('allowed id set', allowedIDsSet)
      const filteredTasks = allTasks.filter((pratica) => allowedIDsSet.has(pratica.cr9b3_praticaid))
      // console.log('not default access', filteredTasks)
      permittedTasks = filteredTasks
      praticheList = filteredTasks
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
  } finally {
    return { praticheList, archiveList, permittedTasks }
  }
}
