import { CToast, CToastBody, CToastHeader } from '@coreui/react-pro'
import { createAxiosInstance, getAccessToken, initializeAxiosInstance } from './axiosUtils'
import React from 'react'
import { getAccessTokenForGraph } from './axiosUtils'

export const getLabelColor = (index) => {
  let color
  let label
  switch (index) {
    case 129580000:
      color = 'dark'
      label = 'RICHIESTA CONTRIBUTO'
      break
    case 129580001:
      color = 'blue'
      label = 'PROGETTO ESTERNO'
      break
    case 129580002:
      color = 'indigo'
      label = 'EVENTO'
      break
    case 129580003:
      color = 'purple'
      label = 'RICEZIONE RAPPORTI'
      break
    case 129580004:
      color = 'green'
      label = 'VISITA'
      break
    case 129580005:
      color = 'teal'
      label = 'SENZA RICHIESTA - EVENTO'
      break
    case 129580006:
      color = 'cyan'
      label = 'SENZA RICHIESTA - LETTERA'
      break
    case 129580007:
      color = 'gray'
      label = 'PURTROPPO'
      break
    case 129580008:
      color = 'warning'
      label = 'GENERICO'
      break
    case 129580009:
      color = 'info'
      label = 'MESSAGGI PONTIFICI'
      break
    default:
      color = 'black'
  }
  return { color: color, label: label }
}

export const emptyTask = {
  cr9b3_prano: '',
  cr9b3_protno: '',
  cr9b3_protno2: '',
  cr9b3_titolo: '',
  cr9b3_status: 0,
  cr9b3_categoria: '',
  cr9b3_debrief: '',
  cr9b3_datainviomateriale: '',
  dssui_primascadenza: '',
  cr9b3_istruzionesuperiori: '',
  cr9b3_datatimbrosuperiore: '',
  cr9b3_datarichiestacontributo: '',
  cr9b3_datainoltrataresponsabile: '',
  cr9b3_enteinviante: '',
  cr9b3_enterichiedente: '',
  cr9b3_entericevente: '',
  cr9b3_personarichiedente: '',
  cr9b3_destinatari: '',
  cr9b3_indirizzidestinatari: '',
  cr9b3_dataevento: '',
  cr9b3_titoloevento: '',
  cr9b3_luogoevento: '',
  cr9b3_temacontributo: '',
  cr9b3_materiarapporto: '',
  cr9b3_superioriinvitati: '',
  cr9b3_sezioneresponsabile: '',
  cr9b3_nopartecipanti: '',
  cr9b3_dssuipartecipanti: '',
  cr9b3_paese: '',
  cr9b3_regione: '',
  cr9b3_citta: '',
  cr9b3_sharepointlink: '',
  cr9b3_corrispondenza: '',
  cr9b3_notes: '',
}

export const getFields = (categoria) => {
  let fields = {}
  let template = {
    data_invio_materiale: false,
    data_prima_scadenza: false,
    data_richiesta_contributo: false,
    ente_inviante: false,
    ente_richiedente: false,
    ente_ricevente: false,
    persona_richiedente: false,
    destinatari: false,
    indirizzi_destinatari: false,
    data_evento: false,
    titolo_evento: false,
    luogo_evento: false,
    tema_contributo: false,
    materia_contributo: false,
    materia_rapporto: false,
    superiori_invitati: false,
    no_partecipanti: false,
    dssui_partecipanti: false,
    paese: false,
    regione: false,
    citta: false,
    correspondence: false,
  }

  switch (categoria) {
    case 12958: //testing
      fields = {
        data_invio_materiale: true,
        data_prima_scadenza: true,
        data_richiesta_contributo: true,
        ente_inviante: true,
        ente_richiedente: true,
        ente_ricevente: true,
        persona_richiedente: true,
        dssui_organizzatore: true,
        destinatari: true,
        indirizzi_destinatari: true,
        data_evento: true,
        titolo_evento: true,
        luogo_evento: true,
        tema_contributo: true,
        materia_contributo: true,
        materia_rapporto: true,
        superiori_invitati: true,
        no_partecipanti: true,
        dssui_partecipanti: true,
        paese: true,
        regione: true,
        citta: true,
        correspondence: true,
      }
      break
    case 129580000: //RICHIESTA CONTRIBUTO
      fields = {
        ...template,
        category: '129580000 RICHIESTA CONTRIBUTO',
        label: 'RICHIESTA CONTRIBUTO - articolo/messaggio',
        data_richiesta_contributo: true,
        ente_richiedente: true,
        tema_contributo: true,
        color: 'dark',
      }
      break
    case 129580001: //PROGETTO ESTERNO
      fields = {
        ...template,
        category: '129580001 PROGETTO ESTERNO',
        label: 'PROGETTO ESTERNO',
        ente_inviante: true,
        paese: true,
        regione: true,
        citta: true,
        color: 'blue',
      }
      break
    case 129580002: //EVENTO
      fields = {
        ...template,
        category: '129580002 EVENTO',
        label: 'EVENTO - viaggio estero/italia/roma',
        data_prima_scadenza: true,
        ente_richiedente: true,
        persona_richiedente: true,
        data_evento: true,
        titolo_evento: true,
        superiori_invitati: true,
        color: 'indigo',
      }
      break
    case 129580003: //RICEZIONE RAPPORTI
      fields = {
        ...template,
        category: '129580003 RICEZIONE RAPPORTI',
        label: 'RICEZIONE DI RAPPORTI - partners, perm miss, Ap. N.',
        ente_inviante: true,
        materia_rapporto: true,
        color: 'purple',
      }
      break
    case 129580004: //VISITA
      fields = {
        ...template,
        category: '129580004 VISITA',
        label: 'VISITA - ogni tipo di partner',
        ente_richiedente: true,
        persona_richiedente: true,
        data_evento: true,
        titolo_evento: true,
        superiori_invitati: true,
        no_partecipanti: true,
        color: 'green',
      }
      break
    case 129580005: //SENZA RICHIESTA - EVENTO
      fields = {
        ...template,
        category: '129580005 SENZA RICHIESTA - EVENTO',
        label: 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invito evento)',
        dssui_organizzatore: true,
        titolo_evento: true,
        dssui_partecipanti: true,
        color: 'teal',
      }
      break
    case 129580006: //SENZA RICHIESTA - LETTERA
      fields = {
        ...template,
        category: 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invio lettera)',
        label: 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invio lettera)',
        ente_ricevente: true,
        color: 'cyan',
      }
      break
    case 129580007: //PURTROPPO
      fields = {
        ...template,
        category: '129580007 PURTROPPO',
        label: 'PURTROPPO - richiesta evento/contributo/altro',
        ente_richiedente: true,
        persona_richiedente: true,
        data_evento: true,
        titolo_evento: true,
        superiori_invitati: true,
        color: 'gray',
      }
      break
    case 129580008: //GENERICO
      fields = {
        ...template,
        category: '129580008 GENERICO',
        label: 'RAPPORTI/DOCUMENTI/INVITI GENERICI - partners, newsletters',
        data_invio_materiale: true,
        destinatari: true,
        indirizzi_destinatari: true,
        materia_contributo: true,
        color: 'warning',
      }
      break
    case 129580009: //MESSAGGI PONTIFICI
      fields = {
        ...template,
        category: '129580009 MESSAGGI PONTIFICI',
        label: 'MESSAGGI PONTIFICI',
        color: 'info',
      }
      break
    case 129580010: //RICHIESTA CONTRIBUTO (NP)
      fields = {
        ...template,
        category: '129580010 RICHIESTA CONTRIBUTO (NP)',
        label: 'RICHIESTA CONTRIBUTO (NP)',
        ente_richiedente: true,
        data_evento: true,
        titolo_evento: true,
        luogo_evento: true,
        superiori_invitati: true,
        color: 'dark',
      }
      break
    default:
    // color = 'black'
  }
  return fields
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
  // const defaultAccess = {
  //   superiors: superiors,
  //   secretariat: secretariat,
  // }

  // return defaultAccess
  return secretariat
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

export const getSystemUserID = async (user) => {
  //azureactivedirectoryobjectid
  const axiosInstance = await initializeAxiosInstance()
  let userID
  try {
    const response = await axiosInstance.get(
      `systemusers?$filter=azureactivedirectoryobjectid eq '${user.id}'`,
    )
    // console.log(
    //   'user id',
    //   response.data.value[0],
    //   response.data.value[0].yomifullname,
    //   response.data.value[0].systemuserid,
    // )
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

export const getCorrs = async (praticaID) => {
  const axiosInstance = await initializeAxiosInstance()
  try {
    const response = await axiosInstance.get(
      `cr9b3_praticas(${praticaID})/cr9b3_Pratica_Correspondence?$orderby=cr9b3_date desc`,
    )
    return response.data.value
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error getting correspondences:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
}

export const getTasks = async (praticaID) => {
  const axiosInstance = await initializeAxiosInstance()
  try {
    const response = await axiosInstance.get(
      `cr9b3_praticas(${praticaID})/cr9b3_pratica_tasks?$orderby=createdon desc`,
    )
    return response.data.value
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error getting correspondences:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
}

// Check if pratica with protNo exists
export const checkIfExistingProt = async (protNo) => {
  try {
    const token = await getAccessToken()
    const axiosInstance = createAxiosInstance(token)

    // Perform the API request
    const response = await axiosInstance.get(`cr9b3_praticas?$filter=cr9b3_protno eq '${protNo}'`)

    // Check if the response contains data
    const exists = response.data.value && response.data.value.length > 0

    // console.log('Does it exist???', exists)
    return exists
  } catch (error) {
    console.error('Error checking protNo existence:', error)
    return false // Return false in case of error (depends on your use case)
  }
}

export const assignRelatedTask = async (praticaID, relatedPraticaID) => {
  const axiosInstance = await initializeAxiosInstance()

  let data1 = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${relatedPraticaID})`,
  }

  let data2 = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${praticaID})`,
  }

  try {
    const response1 = await axiosInstance.post(
      `cr9b3_praticas(${praticaID})/cr9b3_related_pratica/$ref`,
      data1,
    )
    const response2 = await axiosInstance.post(
      `cr9b3_praticas(${relatedPraticaID})/cr9b3_related_pratica/$ref`,
      data2,
    )
    console.log('Successfully linked related pratica', response1.data, response2.data)
    return true
  } catch (error) {
    console.error(
      'Error creating pratica <-> pratica record:',
      error.response ? error.response.data : error.message,
    )
    return false
  }
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
    console.log('Successfully added access:', userID, response.data)
    return true
  } catch (error) {
    console.error(
      'Error creating user <-> pratica record:',
      error.response ? error.response.data : error.message,
    )
    return false
  }
}

export const assignUserToPratica = async (userID, praticaID, table) => {
  const axiosInstance = await initializeAxiosInstance()
  // console.log('adding superiori invitati', userID)
  const data = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${praticaID})`,
  }
  try {
    // POST request to create a relationship in cr9b3_pratica_superiore
    const response = await axiosInstance.post(
      `systemusers(${userID})/${table}/$ref`, //cr9b3_pratica_superiore
      data,
    )
    console.log('Successfully created the user <-> pratica record:', response.data)
    return true
  } catch (error) {
    console.error(
      'Error creating user <-> pratica record:',
      error.response ? error.response.data : error.message,
    )
    return false
  }
}

export const assignUserToTask = async (userID, taskID) => {
  const axiosInstance = await initializeAxiosInstance()
  // console.log('adding superiori invitati', userID)
  const data = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_tasks(${taskID})`,
  }
  try {
    // POST request to create a relationship in cr9b3_task_utente
    const response = await axiosInstance.post(`systemusers(${userID})/cr9b3_task_utente/$ref`, data)
    console.log('Successfully assigned user to task:', response.data)
    return true
  } catch (error) {
    console.error(
      'Error assigning user to task:',
      error.response ? error.response.data : error.message,
    )
    return false
  }
}

export const getPratica = async (praticaID) => {
  const axiosInstance = await initializeAxiosInstance()
  const response = await axiosInstance.get(
    `cr9b3_praticas?$filter=cr9b3_praticaid eq '${praticaID}'`,
  )
  return response.data.value[0]
  // ?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}
}
