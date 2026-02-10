import { useEffect, useState, useCallback } from 'react'
import msalInstance from '../msalConfig'
import { getDefaultAccess, getGroupMembers, getCurrentUser } from '../util/accessUtils'
import { getAxiosInstance, initializeAxiosInstance } from '../util/axiosUtils'

export function useAccessRights() {
  const [defaultAccess, setDefaultAccess] = useState()
  const [combinedTasks, setCombinedTasks] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState()

  const fetchAccessRights = useCallback(async () => {
    const account = msalInstance.getActiveAccount()

    if (!account) {
      // MSAL not ready yet → do nothing, hook will retry
      return
    }

    setLoading(true)
    setError(null)

    try {
      const user = await getCurrentUser()
      const axiosUtils = await initializeAxiosInstance()
      const defaultAccessList = await getDefaultAccess()
      const hasDefaultAccess = !!defaultAccessList.find(
        (u) => u.id === user.azureactivedirectoryobjectid,
      )

      // Tasks
      const [respTasks, officialeTasks, createdTasks, assignedTasks] = await Promise.all([
        axiosUtils.get(
          `cr9b3_pratica_responsabileset?$filter=systemuserid eq ${user.systemuserid}`,
        ),
        axiosUtils.get(
          `cr9b3_pratica_officiali_incaricatiset?$filter=systemuserid eq ${user.systemuserid}`,
        ),
        axiosUtils.get(`cr9b3_praticas?$filter=_createdby_value eq '${user.systemuserid}'`),
        axiosUtils.get(`cr9b3_accessset?$filter=systemuserid eq ${user.systemuserid}`),
      ])

      const combinedTaskList = [
        ...new Set(
          [
            ...respTasks.data.value.map((i) => i.cr9b3_praticaid),
            ...officialeTasks.data.value.map((i) => i.cr9b3_praticaid),
            ...createdTasks.data.value.map((i) => i.cr9b3_praticaid),
            ...assignedTasks.data.value.map((i) => i.cr9b3_praticaid),
          ].filter(Boolean),
        ),
      ]
      setDefaultAccess(hasDefaultAccess)
      setCombinedTasks(combinedTaskList)
      setCurrentUser(currentUser)
    } catch (e) {
      console.error('[useAccessRights]', e)
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  // Run once MSAL has an active account
  useEffect(() => {
    fetchAccessRights()
  }, [fetchAccessRights])

  return {
    defaultAccess,
    combinedTasks,
    currentUser,
    loading,
    error,
    refetch: fetchAccessRights,
  }
}
