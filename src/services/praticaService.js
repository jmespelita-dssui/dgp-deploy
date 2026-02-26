import apiClient from 'src/util/apiClient'
import { sendNotificationtoUser } from './notificationService'
import { getSystemUserID } from './userService'
import { assignUserToPratica, assignUserToTask } from './accessService'
import { logAction } from './applicationLogService'

export const getStatus = (statusNo) => {
  switch (Number(statusNo)) {
    case 10:
      return 'Nuovo'
    case 30:
      return 'In corso'
    case 50:
      return 'In attesa di risposta dal destinatario'
    case 70:
      return 'In attesa di approvazione dal superiore'
    case 40:
      return 'In sospeso'
    case 0:
      return 'Archiviato'
    case 100:
      return 'Completato'
    default:
      return
  }
}

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
  cr9b3_sezione: '',
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

export const getColumnName = (columnID) => {
  switch (columnID) {
    case 'cr9b3_titolo':
      return 'Titolo'
    case 'cr9b3_debrief':
      return 'Briefing'
    case 'cr9b3_destinatari':
      return 'Destinatari'
    case 'cr9b3_enteinviante':
      return 'Ente inviante'
    case 'cr9b3_entericevente':
      return 'Ente ricevente'
    case 'cr9b3_indirizzidestinatari':
      return 'Indirizzi destinatari'
    case 'cr9b3_istruzionesuperiori':
      return 'Istruzioni superiori'
    case 'cr9b3_luogoevento':
      return 'Luogo evento'
    case 'cr9b3_materiarapporto':
      return 'Materia rapporto'
    case 'cr9b3_notes':
      return 'Note'
    case 'cr9b3_personarichiedente':
      return 'Persona richiedente'
    case 'cr9b3_prano':
      return 'Prat. no.'
    case 'cr9b3_protno':
      return 'Prot. no.'
    case 'cr9b3_temacontributo':
      return 'Tema contributo'
    case 'cr9b3_titoloevento':
      return 'Titolo evento'
    case 'cr9b3_message':
      return 'Corrispondenza'
    case 'cr9b3_type':
      return 'Corrispondenza'
    default:
      return ''
  }
}

export const getCorrs = async (praticaID) => {
  try {
    // console.log(userID)
    const response = await apiClient.get(
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
    // await logAction({
    //   userID: userID,
    //   action: 'GET_CORRS',
    //   entityName: 'cr9b3_Pratica_Correspondence',
    //   entityId: praticaID,
    //   details: error.message,
    // })
  }
}

export const getTasks = async (praticaID) => {
  try {
    const response = await apiClient.get(
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

export const getPraticheList = async (level) => {
  let response
  let sections
  let filter
  switch (level) {
    case 1:
      response = await apiClient.get('cr9b3_praticas?$orderby=createdon desc')
      return response.data.value
    case 2:
      sections = ['AD', 'RR', 'CR']
      filter = sections.map((s) => `cr9b3_sezione eq '${s}'`).join(' or ')
      response = await apiClient.get(`cr9b3_praticas?$filter=${filter}&$orderby=createdon desc`)
      return response.data.value
    case 3:
      sections = ['AD', 'EP']
      filter = sections.map((s) => `cr9b3_sezione eq '${s}'`).join(' or ')
      response = await apiClient.get(`cr9b3_praticas?$filter=${filter}&$orderby=createdon desc`)
      return response.data.value
    default:
      return []
  }
}

// Check if pratica with protNo exists
export const checkIfExistingProt = async (protNo) => {
  try {
    // Perform the API request
    const response = await apiClient.get(`cr9b3_praticas?$filter=cr9b3_protno eq '${protNo}'`)
    console.log('checking if', protNo, 'exists', response.data.value)
    // Check if the response contains data
    const exists = response.data.value && response.data.value.length > 0

    // console.log('Does it exist???', exists)
    return exists
  } catch (error) {
    console.error('Error checking protNo existence:', error)
    return false // Return false in case of error (depends on your use case)
  }
}

export const getRelatedPratiche = async (pratica) => {
  if (pratica.cr9b3_praticaid) {
    try {
      const response = await apiClient.get(
        `cr9b3_praticas?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}'&$expand=cr9b3_related_pratica`,
      )
      return response.data.value[0].cr9b3_related_pratica
    } catch (error) {
      if (error.isAxiosError) {
        console.error('Errore Axios nel recupero della pratica correlata:', error.response)
        console.error('Messaggio di errore:', error.message)
        console.error('Risposta di errore:', error.response.data)
      } else {
        console.error('Errore non Axios:', error)
      }
    }
  }
}

export const assignRelatedTask = async (praticaID, relatedPraticaID) => {
  let data1 = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${relatedPraticaID})`,
  }

  let data2 = {
    '@odata.id': `https://orgac85713a.crm4.dynamics.com/api/data/v9.2/cr9b3_praticas(${praticaID})`,
  }

  try {
    await apiClient.post(`cr9b3_praticas(${praticaID})/cr9b3_related_pratica/$ref`, data1)
    await apiClient.post(`cr9b3_praticas(${relatedPraticaID})/cr9b3_related_pratica/$ref`, data2)
    // console.log('Successfully linked related pratica', response1.data, response2.data)
    return true
  } catch (error) {
    console.error(
      'Error creating pratica <-> pratica record:',
      error.response ? error.response.data : error.message,
    )
    return false
  }
}

export const getPratica = async (praticaID) => {
  const response = await apiClient.get(`cr9b3_praticas?$filter=cr9b3_praticaid eq '${praticaID}'`)
  // console.log('getPratica response', praticaID, response.data)
  return response.data.value[0]
  // ?$filter=cr9b3_praticaid eq '${pratica.cr9b3_praticaid}
}

export const assignSuperiors = async (superioriInvitatiList, superioriSystemUserIDs, praticaID) => {
  let newSuperioriList = []
  let superioriToAssign = []
  let superioriToUnassign = []
  try {
    //get system user ids of all assigned superiors
    newSuperioriList = await Promise.all(
      superioriInvitatiList.map(async (id) => {
        return getSystemUserID(id)
      }),
    )

    //determine which superiors were removed
    superioriToUnassign = superioriSystemUserIDs.filter(
      (value) => !newSuperioriList.includes(value),
    )

    //determine which superiors were added
    superioriToAssign = newSuperioriList.filter((value) => !superioriSystemUserIDs.includes(value))

    //axios delete superiors
    if (superioriToUnassign.length > 0) {
      await Promise.all(
        superioriToUnassign.map(async (id) => {
          await apiClient.delete(`cr9b3_praticas(${praticaID})/cr9b3_pratica_superiore(${id})/$ref`)
          sendNotificationtoUser(
            id,
            'La tua assegnazione alla pratica è stata rimossa',
            'unassign',
            praticaID,
          )
        }),
      )
    }

    //axios post new superiors
    if (superioriToAssign.length > 0) {
      await Promise.all(
        superioriToAssign.map(async (id) => {
          return assignUserToTask(id, praticaID, 'cr9b3_pratica_superiore')
        }),
      )
    }

    return { newSuperioriList, superioriToAssign, superioriToUnassign, error: null }
  } catch (error) {
    console.log('error in assignSuperiors', error)
    return { newSuperioriList, superioriToAssign, superioriToUnassign, error: error }
  }
}

export const assignResponsabili = async (
  responsabileList,
  responsabiliSystemUserIDs,
  praticaID,
) => {
  let newResponsabiliList = []
  let responsabiliToAssign = []
  let responsabiliToUnassign = []
  try {
    //get system user ids of assigned responsible
    newResponsabiliList = await Promise.all(
      responsabileList.map(async (id) => {
        return getSystemUserID(id)
      }),
    )

    //determine which responsibles were removed
    responsabiliToUnassign = responsabiliSystemUserIDs.filter(
      (value) => !newResponsabiliList.includes(value),
    )

    //determine which responsibles were added
    responsabiliToAssign = newResponsabiliList.filter(
      (value) => !responsabiliSystemUserIDs.includes(value),
    )

    //axios delete responsible
    if (responsabiliToUnassign.length > 0) {
      await Promise.all(
        responsabiliToUnassign.map(async (id) => {
          await apiClient.delete(
            `cr9b3_praticas(${praticaID})/cr9b3_pratica_responsabile(${id})/$ref`,
          )
          sendNotificationtoUser(
            id,
            'La tua assegnazione alla pratica è stata rimossa',
            'unassign',
            praticaID,
          )
        }),
      )
    }

    //axios add responsible
    if (responsabiliToAssign.length > 0) {
      await Promise.all(
        responsabiliToAssign.map(async (id) => {
          return assignUserToPratica(id, praticaID, 'cr9b3_pratica_responsabile')
        }),
      )
    }
    return { newResponsabiliList, responsabiliToAssign, responsabiliToUnassign, error: null }
  } catch (error) {
    console.error('Errore durante l’assegnazione del responsabile', error)
    return { newResponsabiliList, responsabiliToAssign, responsabiliToUnassign, error: error }
  }
}

export const assignOfficiali = async (
  officialiIncaricatiList,
  officialiIncaricatiSystemUserIDs,
  praticaID,
) => {
  let newOfficialiIncaricatiList = []
  let officialiIncaricatiToAssign = []
  let officialiIncaricatiToUnassign = []
  try {
    //get system user ids of assigned officiali
    newOfficialiIncaricatiList = await Promise.all(
      officialiIncaricatiList.map(async (id) => {
        return getSystemUserID(id)
      }),
    )

    //determine which officiali were removed
    officialiIncaricatiToUnassign = officialiIncaricatiSystemUserIDs.filter(
      (value) => !newOfficialiIncaricatiList.includes(value),
    )

    //determine which officiali were added
    officialiIncaricatiToAssign = newOfficialiIncaricatiList.filter(
      (value) => !officialiIncaricatiSystemUserIDs.includes(value),
    )

    //axios delete official
    if (officialiIncaricatiToUnassign.length > 0) {
      await Promise.all(
        officialiIncaricatiToUnassign.map(async (id) => {
          await apiClient.delete(
            `cr9b3_praticas(${praticaID})/cr9b3_pratica_officiali_incaricati(${id})/$ref`,
          )
          sendNotificationtoUser(
            id,
            'La tua assegnazione alla pratica è stata rimossa',
            'unassign',
            praticaID,
          )
        }),
      )
    }

    //axios add officiali
    if (officialiIncaricatiToAssign.length > 0) {
      await Promise.all(
        officialiIncaricatiToAssign.map(async (id) => {
          return assignUserToPratica(id, praticaID, 'cr9b3_pratica_officiali_incaricati')
        }),
      )
    }
    return {
      newOfficialiIncaricatiList,
      officialiIncaricatiToAssign,
      officialiIncaricatiToUnassign,
      error: null,
    }
  } catch (error) {
    console.error('Errore durante l’assegnazione del officiale', error)
    return {
      newOfficialiIncaricatiList,
      officialiIncaricatiToAssign,
      officialiIncaricatiToUnassign,
      error: error,
    }
  }
}

export const getUserTodo = async (userID) => {
  try {
    const todoList = await apiClient.get(
      `cr9b3_taskses
   ?$select=cr9b3_label,cr9b3_status,cr9b3_deadline
   &$filter=cr9b3_status ne 4 
            and cr9b3_task_utente/any(u:u/systemuserid eq ${userID})
   &$expand=cr9b3_Pratica($select=cr9b3_titolo,cr9b3_praticaid,cr9b3_protno)
   &$orderby=cr9b3_deadline asc`,
    )
    // const todoList = await apiClient.get(`cr9b3_task_utenteset?$filter=systemuserid eq ${userID}`)
    // const response = await apiClient.get(
    //   `cr9b3_praticas(${praticaID})/cr9b3_pratica_tasks?$orderby=createdon desc`,
    // )
    return todoList.data.value
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error getting user todo:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
}
