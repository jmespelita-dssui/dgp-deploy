import { useEffect, useState, useCallback } from 'react'
import msalInstance from '../msalConfig'
import apiClient from 'src/util/apiClient'
import { getCurrentUser } from 'src/services/userService'

export const useAccessRights = () => {
  const [assignedPratiche, setAssignedPratiche] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

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
      setCurrentUser(user)

      // Tasks
      const [respPratiche, officialePratiche, createdPratiche, assigned] = await Promise.all([
        apiClient.get(`cr9b3_pratica_responsabileset?$filter=systemuserid eq ${user.systemuserid}`),
        apiClient.get(
          `cr9b3_pratica_officiali_incaricatiset?$filter=systemuserid eq ${user.systemuserid}`,
        ),
        apiClient.get(`cr9b3_praticas?$filter=_createdby_value eq '${user.systemuserid}'`),
        apiClient.get(`cr9b3_accessset?$filter=systemuserid eq ${user.systemuserid}`),
      ])

      const combinedTaskList = [
        ...new Set(
          [
            ...respPratiche.data.value.map((i) => i.cr9b3_praticaid),
            ...officialePratiche.data.value.map((i) => i.cr9b3_praticaid),
            ...createdPratiche.data.value.map((i) => i.cr9b3_praticaid),
            ...assigned.data.value.map((i) => i.cr9b3_praticaid),
          ].filter(Boolean),
        ),
      ]
      setAssignedPratiche(combinedTaskList)
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
    currentUser,
    assignedPratiche,
    loading,
    error,
    refetch: fetchAccessRights,
  }
}
