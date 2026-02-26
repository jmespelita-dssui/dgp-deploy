import { createAxiosInstance, getAccessTokenForGraph } from '../util/axiosUtils'
import { sendNotificationtoUser } from './notificationService'
import apiClient from 'src/util/apiClient'
import { getCurrentUser, getGroupMembers, getUser, getUserName } from './userService'
import { getPratica, getPraticheList } from './praticaService'
import { get } from 'lodash'

export const getAssignedUsers = async (pratica) => {
  let superioriInvitati = []
  let superioriSystemUserIDs = []
  let responsabiliAssegnati = []
  let responsabiliSystemUserIDs = []
  let officialiIncaricati = []
  let officialiIncaricatiSystemUserIDs = []

  try {
    // Perform same operations for both invited superiors and assigned responsible
    if (pratica.cr9b3_praticaid) {
      const superioriIDs = await getAssignedUserIDs(
        'cr9b3_pratica_superiore',
        pratica.cr9b3_praticaid,
      )
      const responsabiliIDs = await getAssignedUserIDs(
        'cr9b3_pratica_responsabile',
        pratica.cr9b3_praticaid,
      )
      const officialiIncaricatiIDs = await getAssignedUserIDs(
        'cr9b3_pratica_officiali_incaricati',
        pratica.cr9b3_praticaid,
      )

      const superiorUserDetailsPromises = superioriIDs.azureactivedirectoryobjectid.map(
        async (userID) => {
          return await getUserGraphDetails(userID)
        },
      )

      const responsabileUserDetailsPromises = responsabiliIDs.azureactivedirectoryobjectid.map(
        async (userID) => {
          return await getUserGraphDetails(userID)
        },
      )
      const officialiIncaricatiUserDetailsPromises =
        officialiIncaricatiIDs.azureactivedirectoryobjectid.map(async (userID) => {
          return await getUserGraphDetails(userID)
        })

      // Wait for all user details to be fetched
      const superiorUsersDetails = await Promise.all(superiorUserDetailsPromises)
      superioriInvitati = superiorUsersDetails
      superioriSystemUserIDs = superioriIDs.systemuserid

      const responsabileUsersDetails = await Promise.all(responsabileUserDetailsPromises)
      responsabiliAssegnati = responsabileUsersDetails
      responsabiliSystemUserIDs = responsabiliIDs.systemuserid

      const officialiIncaricatiDetails = await Promise.all(officialiIncaricatiUserDetailsPromises)
      officialiIncaricati = officialiIncaricatiDetails
      officialiIncaricatiSystemUserIDs = officialiIncaricatiIDs.systemuserid

      // Get system information on creator and modifier
      const createdBy = await getUserName(pratica._createdby_value)
      const modifiedBy = await getUserName(pratica._modifiedby_value)

      return {
        superioriInvitati,
        superioriSystemUserIDs,
        responsabiliAssegnati,
        responsabiliSystemUserIDs,
        officialiIncaricati,
        officialiIncaricatiSystemUserIDs,
        createdBy,
        modifiedBy,
      }
    }
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error getting user ID:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
  // return userID
}

const getAssignedUserIDs = async (tableName, praticaID) => {
  let user
  let azureactivedirectoryobjectid
  let systemuserid
  const response = await apiClient.get(
    `cr9b3_praticas?$filter=cr9b3_praticaid eq '${praticaID}'&$expand=${tableName}`,
  )
  if (tableName === 'cr9b3_pratica_superiore') {
    user = response.data.value[0].cr9b3_pratica_superiore
  } else if (tableName === 'cr9b3_pratica_responsabile') {
    user = response.data.value[0].cr9b3_pratica_responsabile
  } else if (tableName === 'cr9b3_pratica_officiali_incaricati') {
    user = response.data.value[0].cr9b3_pratica_officiali_incaricati
  }

  azureactivedirectoryobjectid = user.map((user) => user.azureactivedirectoryobjectid)
  systemuserid = user.map((user) => user.systemuserid)

  return {
    azureactivedirectoryobjectid: azureactivedirectoryobjectid,
    systemuserid: systemuserid,
  }
}

export const getUniqueListById = (arr) => {
  const seen = new Set()
  return arr
    .filter((item) => (Array.isArray(item) ? item.length > 0 : true)) // remove empty arrays
    .filter((item) => {
      const obj = Array.isArray(item) ? item[0] : item // support nested arrays
      if (!obj || !obj.id) return false
      if (seen.has(obj.id)) return false
      seen.add(obj.id)
      return true
    })
}

export const getPermissionList = async () => {
  try {
    // Fetch all tasks
    const response = await apiClient.get('cr9b3_permissions?$orderby=cr9b3_role asc')
    let access = response.data.value
    return access
  } catch (error) {
    console.error('Error fetching access entries:', error)
  }
}

export const checkUserRole = async (azureID) => {
  if (!azureID) {
    const currentUser = await getCurrentUser()
    azureID = currentUser.azureactivedirectoryobjectid
  }
  const access = await getPermissionList()
  let role = access.some((item) => item.cr9b3_azureid === azureID && item.cr9b3_role === 129580000)
    ? 'admin'
    : access.some((item) => item.cr9b3_azureid === azureID && item.cr9b3_role === 129580001)
    ? 'advancedUser'
    : access.some((item) => item.cr9b3_azureid === azureID && item.cr9b3_role === 129580002)
    ? 'supervisor'
    : 'user'
  return role
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
    const fullAccessList = await getFullAccessList(pratica, officialiIncaricati)
    // console.log(actorGraphDetails, responsabile)
    const exists = fullAccessList.some((item1) => {
      const match = item1 === actorGraphDetails.id
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

export const getFullAccessList = async (pratica, officialiIncaricati) => {
  const superiors = await getGroupMembers('208d6ffd-8a3c-4fc0-8248-994a88af2356')
  const secretariat = await getGroupMembers('577d6747-ee6c-42ac-a71a-45a497a27a98')
  const responsibles = await getGroupMembers('2e227ba3-c594-4117-b106-d9735ddf4d26')

  // todo: remove test group and replace with actual groups once identified
  const test = await getGroupMembers('79002d73-f310-4369-93e1-cb76ef304ff7')

  const defaultUserList = [...superiors, ...secretariat, ...responsibles, ...test]
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

  const fullAccessList = [
    ...(defaultUserList || []),
    ...(officialiIncaricati || []),
    creatorGraphDetails,
    ...usersWithAccessDetails,
  ]
  return fullAccessList.map((user) => user.id)
}

export const removeAccess = async (praticaID, systemuserid) => {
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

export const assignUserToPratica = async (userID, praticaID, table) => {
  // console.log('adding superiori invitati', userID)
  const data = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${praticaID})`,
  }
  try {
    // POST request to create a relationship in cr9b3_pratica_superiore
    const response = await apiClient.post(
      `systemusers(${userID})/${table}/$ref`, //cr9b3_pratica_superiore
      data,
    )
    // console.log('Successfully created the user <-> pratica record:', response.data)
    sendNotificationtoUser(userID, 'ti ha assegnato una pratica', 'pratica', praticaID)
    return true
  } catch (error) {
    console.error(
      'Error creating user <-> pratica record:',
      error.response ? error.response.data : error.message,
    )
    return false
  }
}

export const assignUserToTask = async (userID, taskID, praticaID) => {
  // console.log('adding superiori invitati', userID)
  const data = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_taskses(${taskID})`,
  }
  try {
    sendNotificationtoUser(userID, 'ti ha assegnato un task', 'task', praticaID)
    // POST request to create a relationship in cr9b3_task_utente
    await apiClient.post(`systemusers(${userID})/cr9b3_task_utente/$ref`, data)
    // console.log('Successfully assigned user to task:', response.data)
    return true
  } catch (error) {
    console.error(
      'Error assigning user to task:',
      error.response ? error.response.data : error.message,
    )
    return false
  }
}

export const getAccessLevel = async () => {
  const currentUser = await getCurrentUser()
  const userGroups = await getUserGraphGroups(currentUser.azureactivedirectoryobjectid)
  const role = await checkUserRole(currentUser.azureactivedirectoryobjectid)
  let accessLevel = userGroups.value.some(
    (group) =>
      group.id === getGroupIDBySection('SUP') ||
      group.id === getGroupIDBySection('SEC') ||
      group.id === getGroupIDBySection('RESP') ||
      role === 'admin' ||
      role === 'advancedUser' ||
      role === 'supervisor',
  )
    ? 1
    : userGroups.value.some(
        (group) =>
          group.id === getGroupIDBySection('AD') ||
          group.id === getGroupIDBySection('RR') ||
          group.id === getGroupIDBySection('CR'),
      )
    ? 2
    : userGroups.value.some((group) => group.id === getGroupIDBySection('EP'))
    ? 3
    : 0

  return accessLevel
}

export const getDefaultAccessUsers = async () => {
  const superiors = await getGroupMembers('208d6ffd-8a3c-4fc0-8248-994a88af2356')
  const secretariat = await getGroupMembers('577d6747-ee6c-42ac-a71a-45a497a27a98')
  const responsibles = await getGroupMembers('2e227ba3-c594-4117-b106-d9735ddf4d26')
  const test = await getGroupMembers('79002d73-f310-4369-93e1-cb76ef304ff7')
  const defaultAccessUsers = [...superiors, ...secretariat, ...responsibles, ...test]
  return defaultAccessUsers
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

export const getUserGraphGroups = async (userID) => {
  try {
    const token = await getAccessTokenForGraph()
    const axiosInstance = createAxiosInstance(token)

    // Fetch user details using systemuserid

    const response = await axiosInstance.get(
      `https://graph.microsoft.com/v1.0/users/${userID}/memberOf`,
    )
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

export const getGroupIDBySection = (section) => {
  switch (section) {
    case 'SUP':
      return '208d6ffd-8a3c-4fc0-8248-994a88af2356'
    case 'SEC':
      return '577d6747-ee6c-42ac-a71a-45a497a27a98'
    case 'RESP':
      return '2e227ba3-c594-4117-b106-d9735ddf4d26'
    case 'AD':
      return '68990e44-bec6-44c6-ade1-4b018d88a5c3'
    case 'RR':
      return 'dd176b7d-028d-439a-b6bb-7987c55c3c31'
    case 'CR':
      return '8c098b27-b225-4a55-b035-2c67641337fe'
    case 'EP':
      return '581aefa6-5072-4a2c-9138-e60168e0814e'
    default:
      return null
  }
}

export const filterPratiche = async (assignedPratiche, isArchive) => {
  let archiveList = []
  let permittedPratiche = []
  let assignedPraticheDetails = []
  assignedPraticheDetails = await Promise.all(assignedPratiche.map((id) => getPratica(id)))
  // }

  try {
    const accessLevel = await getAccessLevel()
    permittedPratiche = await getPraticheList(accessLevel)
    permittedPratiche = [...permittedPratiche, ...assignedPraticheDetails]

    //eliminate duplicates from permittedPratiche based on cr9b3_praticaid
    const cleaned = permittedPratiche.filter((p) => p?.cr9b3_praticaid)

    permittedPratiche = [...new Map(cleaned.map((p) => [p.cr9b3_praticaid, p])).values()]
    if (isArchive) {
      archiveList = permittedPratiche.filter((row) => row.cr9b3_status === 0)
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
  } finally {
    return { archiveList, permittedPratiche }
  }
}
