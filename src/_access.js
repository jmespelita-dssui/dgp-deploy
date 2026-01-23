import React from 'react'
import { getDefaultAccess, getUser, getGroupMembers } from './util/accessUtils'
import { initializeAxiosInstance } from './util/axiosUtils'

const setAccessRights = async () => {
  const axiosInstance = await initializeAxiosInstance()
  const whoami = (await axiosInstance.get('WhoAmI')).data.UserId
  const whoamiUser = await getUser(whoami)
  const me = whoamiUser.azureactivedirectoryobjectid

  const defaultAccess = await checkDefaultAccess(me)
  //   setHasDefaultAccess(defaultAccess)

  const respTasks = await axiosInstance.get(
    `cr9b3_pratica_responsabileset?$filter=systemuserid eq ${whoami}`,
  )

  let respTasksIDs = respTasks.data.value.map((item) => item.cr9b3_praticaid)

  const officialeTasks = await axiosInstance.get(
    `cr9b3_pratica_officiali_incaricatiset?$filter=systemuserid eq ${whoami}`,
  )
  let officialeTasksIDs = officialeTasks.data.value.map((item) => item.cr9b3_praticaid)

  const createdTasks = await axiosInstance.get(
    `cr9b3_praticas?$filter=_createdby_value eq '${whoami}'`,
  )

  let createdTasksIDs = createdTasks.data.value.map((item) => item.cr9b3_praticaid)

  const assignedTasks = await axiosInstance.get(`cr9b3_accessset?$filter=systemuserid eq ${whoami}`)
  let assignedTasksIDs = assignedTasks.data.value.map((item) => item.cr9b3_praticaid)

  const combinedTasks = [
    ...new Set(
      [...respTasksIDs, ...officialeTasksIDs, ...createdTasksIDs, ...assignedTasksIDs].filter(
        (item) => item != null,
      ),
    ),
  ]
  // console.log(combinedTasks)
  //get superiors and secretariat members
  const superiors = await getGroupMembers('317aa3d0-a94a-4c7c-bcb9-8870cfececa4')
  const secretariat = await getGroupMembers('f67d3e5d-02c7-4d4d-8b95-834533623ad6')

  return {
    defaultAccess: defaultAccess,
    combinedTasks: combinedTasks,
    superiors: superiors,
    secretariat: secretariat,
  }
}

const checkDefaultAccess = async (me) => {
  const accessList = await getDefaultAccess()
  // console.log('access list:', accessList)
  return accessList.find((user) => user.id === me) ? true : false
}

const _access = await setAccessRights()

export default _access
