import apiClient from 'src/util/apiClient'

export const logAction = async ({ userID, action, entityName, entityId, details }) => {
  const log = {
    cr9b3_name: `${action} - ${entityName}`,
    cr9b3_action: action,
    cr9b3_entityname: entityName,
    cr9b3_entityid: entityId,
    cr9b3_details: JSON.stringify(details || {}),
    cr9b3_timestamp: new Date().toISOString(),
    'cr9b3_user@odata.bind': `/systemusers(${userID})`,
  }
  console.log(log)

  await apiClient.post(`cr9b3_applicationlogs`, log)
}
