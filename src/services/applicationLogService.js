import apiClient from 'src/util/apiClient'

// In-memory cache to prevent duplicate logs
const loggedActions = new Set()

export const logAction = async (user, action, entityName, entityID, details) => {
  // Create a unique key to avoid duplicates
  const uniqueKey = `${user}_${action}_${entityName}_${entityID}_${details.slice(0, 10)}`
  console.log(uniqueKey)
  if (loggedActions.has(uniqueKey)) return // already logged
  loggedActions.add(uniqueKey)

  const truncatedDetails = details.length > 100 ? details.slice(0, 100) : details
  // Truncate details to max 100 chars (Dataverse limit)

  try {
    await apiClient.post('/cr9b3_applicationlogs', {
      cr9b3_actor: user,
      cr9b3_name: `${action} - ${entityName}`,
      cr9b3_action: action,
      cr9b3_entityname: entityName,
      cr9b3_entityid: entityID,
      cr9b3_details: truncatedDetails,
      // 'cr9b3_user@odata.bind': `/systemusers(${userID})`,
    })
  } catch (err) {
    console.error('Error logging action:', err)
  }
}
