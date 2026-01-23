import { initializeAxiosInstance } from './axiosUtils'

const sampleData = [
  {
    user: 'Giulia Rinaldi',
    actionType: 'edited task details.',
    actions: [
      { title: 'Title', input: 'This is a test for multiple protocol numbers.' },
      { title: 'Correspondence', input: 'Error on dataloading' },
    ],
    timestamp: '2025-04-01T11:20:00Z',
  },
]

const getRow = (title, input) => {
  switch (title) {
    case 'cr9b3_prano':
      return { title: 'Prat. no.', input: input }
    case 'cr9b3_protno':
      return { title: 'Prot. no.', input: input }
    case 'cr9b3_protno2':
      let protno2 = input ? JSON.parse(input).join(', ') : input
      return { title: 'Ulteriore prot. no.', input: protno2 }
    case 'cr9b3_titolo':
      return { title: 'Title', input: input }
    case 'cr9b3_status':
      let label = null
      switch (input) {
        case '10':
          label = 'Nuovo'
          break
        case '30':
          label = 'In corso'
          break
        case '50':
          label = 'In attesa di risposta dal destinatario'
          break
        case '70':
          label = 'In attesa di approvazione dal superiore'
          break
        case '40':
          label = 'In sospeso'
          break
        case '0':
          label = 'Archiviato'
          break
        case '100':
          label = 'Completato'
          break
        default:
          label = null
          break
      }

      return { title: 'Stato', input: label }
    case 'cr9b3_categoria':
      let category = null
      switch (input) {
        case 129580000:
          category = 'RICHIESTA CONTRIBUTO - articolo/messaggio'
          break
        case 129580001:
          category = 'PROGETTO ESTERNO'
          break
        case 129580002:
          category = 'EVENTO - viaggio estero/italia/roma'
          break
        case 129580003:
          category = 'RICEZIONE DI RAPPORTI - partners, perm miss, Ap. N.'
          break
        case 129580004:
          category = 'VISITA - ogni tipo di partner'
          break
        case 129580005:
          category = 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invito evento)'
          break
        case 129580006:
          category = 'SENZA RICHIESTA - nostra iniziativa/co-organizzata (invio lettera)'
          break
        case 129580007:
          category = 'PURTROPPO - richiesta evento/contributo/altro'
          break
        case 129580008:
          category = 'RAPPORTI/DOCUMENTI/INVITI GENERICI - partners, newsletters'
          break
        case 129580009:
          category = 'MESSAGGI PONTIFICI'
          break
        case 129580010:
          category = 'RICHIESTA CONTRIBUTO (NP)'
          break
        default:
          category = null
          break
      }
      return { title: 'Categoria', input: category }
    case 'cr9b3_debrief':
      return { title: 'Debrief', input: input }
    case 'cr9b3_datainviomateriale':
      return { title: 'Data invio materiale', input: input }
    case 'dssui_primascadenza':
      return { title: 'Data prima scadenza', input: input }
    case 'cr9b3_istruzionesuperiori':
      return { title: 'Istruzione superiori', input: input }
    case 'cr9b3_datatimbrosuperiore':
      return { title: 'Data timbro superiore', input: input }
    case 'cr9b3_datarichiestacontributo':
      return { title: 'Data richiesta contributo', input: input }
    case 'cr9b3_datainoltrataresponsabile':
      return { title: 'Data inoltrata responsabile', input: input }
    case 'cr9b3_enteinviante':
      return { title: 'Ente inviante', input: input }
    case 'cr9b3_enterichiedente':
      return { title: 'Ente richiedente', input: input }
    case 'cr9b3_entericevente':
      return { title: 'Ente ricevente', input: input }
    case 'cr9b3_personarichiedente':
      return { title: 'Persona richiedente', input: input }
    case 'cr9b3_destinatari':
      return { title: 'Destinatari', input: input }
    case 'cr9b3_indirizzidestinatari':
      return { title: 'Indirizzi destinatari', input: input }
    case 'cr9b3_dataevento':
      return { title: 'Data evento', input: input }
    case 'cr9b3_titoloevento':
      return { title: 'Titolo evento', input: input }
    case 'cr9b3_luogoevento':
      return { title: 'Luogo evento', input: input }
    case 'cr9b3_temacontributo':
      return { title: 'Tema contributo', input: input }
    case 'cr9b3_materiarapporto':
      return { title: 'Materia rapporto', input: input }
    case 'cr9b3_superioriinvitati':
      return { title: 'Superiori invitati', input: input }
    case 'cr9b3_sezioneresponsabile':
      return { title: 'Sezione responsabile', input: input }
    case 'cr9b3_nopartecipanti':
      return { title: 'No partecipanti', input: input }
    case 'cr9b3_dssuipartecipanti':
      return { title: 'DSSUI partecipanti', input: input }
    case 'cr9b3_paese':
      return { title: 'Paese', input: input }
    case 'cr9b3_regione':
      return { title: 'Regione', input: input }
    case 'cr9b3_citta':
      return { title: 'Città', input: input }
    case 'cr9b3_sharepointlink':
      return { title: 'Sharepoint Link', input: input }
    case 'cr9b3_links':
      return { title: 'Links', input: input }
    case 'cr9b3_corrispondenza':
      return { title: 'Corrispondenza', input: input }
    case 'cr9b3_notes':
      return { title: 'Notes', input: input }
    case 'superioriInvitati':
      return { title: 'Superiori invitati', input: input }
    case 'responsabili':
      return { title: 'Responsabile Sezione', input: input }
    case 'officiali':
      return { title: 'Officiale incaricato', input: input }
    default:
      return { title: title, input: input }
  }
}

const cleanInputString = (action) => {
  let slicedAction
  if (typeof action === 'string' || Array.isArray(action)) {
    // Only apply .slice if action is a string or array
    slicedAction = `${action.slice(0, action.length > 70 ? 70 : action.length)}${
      action.length > 70 ? '...' : ''
    }` // Example
    return slicedAction
  } else {
    // console.log('action is not a string or array')
    return action
  }
}

export const getUpdatedActivityLog = async (praticaID) => {
  try {
    const axiosInstance = await initializeAxiosInstance()
    let response = await axiosInstance.get(`cr9b3_praticas(${praticaID})/cr9b3_activitylog`)
    // console.log(JSON.parse(response.data.value))
    return response.data.value ? JSON.parse(response.data.value) : ''
  } catch (error) {
    if (error.isAxiosError) {
      console.error('Axios error details adding log entry:', error.response)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response.data)
    } else {
      console.error('Non-Axios error:', error)
    }
  }
}

export const generateActivityLogEntry = (
  prat,
  superioriInvitatiList,
  responsabileList,
  officialiIncaricatiList,
) => {
  let superiori = superioriInvitatiList
    ? superioriInvitatiList.map((user) => user.displayName).join(', ')
    : null
  let responsabili = responsabileList
    ? responsabileList.map((user) => user.displayName).join(', ')
    : null
  let officiali = officialiIncaricatiList
    ? officialiIncaricatiList.map((user) => user.displayName).join(', ')
    : null

  let consolidatedPratica
  consolidatedPratica = {
    ...prat,
    superioriInvitati: superiori,
    responsabili: responsabili,
    officiali: officiali,
  }
  // console.log(consolidatedPratica)
  const activityLogEntry = Object.entries(consolidatedPratica)
    .filter(
      ([field, action]) =>
        action !== null &&
        field !== 'cr9b3_praticaid' &&
        field !== 'cr9b3_datainoltrataresponsabile',
    ) // Exclude null & specific title
    .map(([field, action]) => ({
      title: getRow(field, action).title,
      input: field === 'cr9b3_links' ? action : cleanInputString(getRow(field, action).input),
    }))

  // console.log(activityLogEntry)

  return activityLogEntry // Final object

  //   console.log(prat, superioriInvitatiList, responsabileList, officialiIncaricatiList, action)
}

export const logActivity = async (praticaID, finalLogEntry) => {
  // console.log('and finally:', praticaID, finalLogEntry)
  if (finalLogEntry.length <= 10000) {
    try {
      const axiosInstance = await initializeAxiosInstance()
      const displayLog = [...finalLogEntry].sort(
        (a, b) => new Date(b.timestamp.replace(' ', 'T')) - new Date(a.timestamp.replace(' ', 'T')),
      )

      await axiosInstance.patch(`cr9b3_praticas(${praticaID})`, {
        cr9b3_activitylog: JSON.stringify(finalLogEntry),
      })
      console.log(displayLog)
      // console.log(response)
    } catch (error) {
      if (error.isAxiosError) {
        console.error('Axios error details adding log entry:', error.response)
        console.error('Error message:', error.message)
        console.error('Error response:', error.response.data)
      } else {
        console.error('Non-Axios error:', error)
      }
    }
  }
}
