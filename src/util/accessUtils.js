import { createAxiosInstance, getAccessTokenForGraph, initializeAxiosInstance } from './axiosUtils'

export const getUserAccessList = async () => {
  try {
    // Fetch any necessary data for the admin console here
    const axiosInstance = await initializeAxiosInstance()
    // Fetch all tasks
    const response = await axiosInstance.get('cr9b3_permissions?$orderby=cr9b3_role asc')
    // console.log('all tasks', response.data)
    let access = response.data.value
    return access
  } catch (error) {
    console.error('Error fetching access entries:', error)
  }
}

export const checkAdminAccess = async () => {
  const axiosInstance = await initializeAxiosInstance()
  const access = await getUserAccessList()
  const whoami = await axiosInstance.get('WhoAmI')
  const userid = await getEmailAddress(whoami.data.UserId)
  let isAdmin = access.some((item) => item.cr9b3_userid === userid && item.cr9b3_role === 129580000)
  //   setHasAdminAccess(isAdmin)
  return isAdmin
}

export const checkSpecialAccess = async () => {
  const axiosInstance = await initializeAxiosInstance()
  const access = await getUserAccessList()
  const whoami = await axiosInstance.get('WhoAmI')
  const userid = await getEmailAddress(whoami.data.UserId)
  let hasSpecialAccess = access.some((item) => item.cr9b3_userid === userid)
  //   setHasAdminAccess(isAdmin)
  return hasSpecialAccess
}

export const getUserAccessLevel = async (accessList, userId) => {
  const accessItem = accessList.find((item) => item.cr9b3_userid === userId)
  return accessItem ? accessItem.cr9b3_role : null
}

export const giveAccess = async (userID, praticaID) => {
  const axiosInstance = await initializeAxiosInstance()
  const data = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${praticaID})`,
  }
  try {
    // POST request to create a relationship in cr9b3_pratica_superiore
    const response = await axiosInstance.post(
      `systemusers(${userID})/cr9b3_access/$ref`, //cr9b3_pratica_superiore
      data,
    )
    // console.log('Successfully added access:', userID, response.data)
    return true
  } catch (error) {
    console.error(
      'Error creating user <-> pratica record:',
      error.response ? error.response.data : error.message,
    )
    return false
  }
}

export const getSystemUserID = async (user) => {
  //azureactivedirectoryobjectid
  const axiosInstance = await initializeAxiosInstance()
  let userID
  try {
    const response = await axiosInstance.get(
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

export const getUserName = async (userID) => {
  //systemuserid
  const axiosInstance = await initializeAxiosInstance()
  const userNamePromise = await axiosInstance.get(`systemusers(${userID})`)
  return userNamePromise.data.fullname
}

export const getEmailAddress = async (userID) => {
  //systemuserid
  const axiosInstance = await initializeAxiosInstance()
  const userNamePromise = await axiosInstance.get(`systemusers(${userID})`)
  return userNamePromise.data.internalemailaddress
}
export const getUser = async (userID) => {
  //systemuserid
  const axiosInstance = await initializeAxiosInstance()
  const userNamePromise = await axiosInstance.get(`systemusers(${userID})`)
  return userNamePromise.data
}
