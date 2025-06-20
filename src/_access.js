import React from 'react'
import { getDefaultAccess, getUser } from './util/taskUtils'
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
  return { defaultAccess: defaultAccess, combinedTasks: combinedTasks }
}

const checkDefaultAccess = async (me) => {
  const accessList = await getDefaultAccess()
  return accessList.find((user) => user.id === me)
}

const _access = await setAccessRights()

export default _access
