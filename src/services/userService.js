import apiClient from 'src/util/apiClient'
import { createAxiosInstance, getAccessTokenForGraph } from 'src/util/axiosUtils'

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
